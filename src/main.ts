import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validatorPipe } from './core/http/validation/validator.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(validatorPipe);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
    .then(()=>{
    console.log('Application is running on port', process.env.PORT ?? 3000);
    }).catch((err) => {
  console.error('Error during application bootstrap:', err);
});
