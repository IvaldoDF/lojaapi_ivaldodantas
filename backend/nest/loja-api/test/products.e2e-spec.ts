import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Products e2e (P)', () => {
  let app: INestApplication;
  let tokenAna: string;
  let tokenCli: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    // Mesmas opções do main.ts — senão o e2e não testa a API real
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();

    const loginAna = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'ana', password: 'secret123' })
      .expect(200);
    tokenAna = loginAna.body.access_token;

    const loginCli = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'cli', password: 'secret123' })
      .expect(200);
    tokenCli = loginCli.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /products válido (Ana) → 201', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${tokenAna}`)
      .send({ name: 'Caneca', price: 39.9, stock: 5 })
      .expect(201);
  });

  it('POST /products inválido → 400', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${tokenAna}`)
      .send({ name: 'X', price: -1, stock: 0 })
      .expect(400);
  });

  it('GET /products/:id inexistente → 404', async () => {
    await request(app.getHttpServer()).get('/products/999999').expect(404);
  });

  it('POST /products sem token → 401', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Caneca', price: 10, stock: 1 })
      .expect(401);
  });

  it('POST /products com Cli (CLIENT) → 403', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${tokenCli}`)
      .send({ name: 'Hack', price: 1, stock: 1 })
      .expect(403);
  });
});