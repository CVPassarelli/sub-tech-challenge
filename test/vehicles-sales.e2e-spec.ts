import { execSync } from 'child_process';
import {
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { JwtAuthGuard } from '../src/modules/auth/presentation/guards/jwt-auth.guard';

const VALID_TEST_TOKEN = 'Bearer e2e-test-token';
const CONTAINER_NAME = 'vehicle-sales-e2e-postgres';

interface VehicleBody {
  id: string;
  status: string;
}

interface SaleBody {
  vehicleId: string;
  buyerExternalId: string;
  priceAtSale: number;
}

class FakeJwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string>; user?: unknown }>();
    if (request.headers.authorization !== VALID_TEST_TOKEN) {
      throw new UnauthorizedException();
    }
    request.user = { sub: 'e2e-buyer-1' };
    return true;
  }
}

function startTestDatabase(): string {
  execSync(`docker rm -f ${CONTAINER_NAME}`, { stdio: 'ignore' });
  execSync(
    `docker run -d --name ${CONTAINER_NAME} -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=vehicle_sales_e2e -p 0:5432 postgres:16-alpine`,
    { stdio: 'ignore' },
  );

  const portOutput = execSync(`docker port ${CONTAINER_NAME} 5432`).toString().trim();
  const port = portOutput.split(':').pop();

  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      execSync(`docker exec ${CONTAINER_NAME} pg_isready -U postgres`, { stdio: 'ignore' });
      break;
    } catch {
      execSync('node -e "setTimeout(() => {}, 1000)"');
    }
  }

  return `postgresql://postgres:postgres@localhost:${port}/vehicle_sales_e2e?schema=public`;
}

function stopTestDatabase(): void {
  execSync(`docker rm -f ${CONTAINER_NAME}`, { stdio: 'ignore' });
}

describe('Vehicles + Sales (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const databaseUrl = startTestDatabase();
    process.env.DATABASE_URL = databaseUrl;
    process.env.KEYCLOAK_ISSUER_URL = 'http://localhost:8080/realms/vehicle-sales';
    process.env.KEYCLOAK_JWKS_URI =
      'http://localhost:8080/realms/vehicle-sales/protocol/openid-connect/certs';
    process.env.KEYCLOAK_AUDIENCE = 'account';

    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: 'inherit',
    });

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(new FakeJwtAuthGuard())
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    stopTestDatabase();
  });

  it('runs the full purchase flow end-to-end', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/vehicles')
      .send({ brand: 'Toyota', model: 'Corolla', year: 2022, color: 'Prata', price: 95000 })
      .expect(201);

    const createBody = createResponse.body as VehicleBody;
    const vehicleId = createBody.id;
    expect(vehicleId).toBeDefined();
    expect(createBody.status).toBe('AVAILABLE');

    const availableResponse = await request(app.getHttpServer())
      .get('/vehicles/available')
      .expect(200);
    const availableBody = availableResponse.body as VehicleBody[];
    expect(availableBody.some((v) => v.id === vehicleId)).toBe(true);

    await request(app.getHttpServer()).post('/sales').send({ vehicleId }).expect(401);

    const purchaseResponse = await request(app.getHttpServer())
      .post('/sales')
      .set('Authorization', VALID_TEST_TOKEN)
      .send({ vehicleId })
      .expect(201);

    const purchaseBody = purchaseResponse.body as SaleBody;
    expect(purchaseBody.vehicleId).toBe(vehicleId);
    expect(purchaseBody.buyerExternalId).toBe('e2e-buyer-1');
    expect(purchaseBody.priceAtSale).toBe(95000);

    const soldResponse = await request(app.getHttpServer()).get('/vehicles/sold').expect(200);
    const soldBody = soldResponse.body as VehicleBody[];
    expect(soldBody.some((v) => v.id === vehicleId)).toBe(true);

    const availableAfterSaleResponse = await request(app.getHttpServer())
      .get('/vehicles/available')
      .expect(200);
    const availableAfterSaleBody = availableAfterSaleResponse.body as VehicleBody[];
    expect(availableAfterSaleBody.some((v) => v.id === vehicleId)).toBe(false);

    await request(app.getHttpServer())
      .post('/sales')
      .set('Authorization', VALID_TEST_TOKEN)
      .send({ vehicleId })
      .expect(409);
  });
});
