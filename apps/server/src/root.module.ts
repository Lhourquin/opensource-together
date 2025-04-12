import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';
import { AuthModule } from '@infrastructures/auth/auth.module';
import { CqrsWiringModule } from '@infrastructures/cqrs/cqrs-wiring.module';
import { PresentationModule } from '@presentation/presentation.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule.forRoot(),
    AuthModule,
    CqrsWiringModule,
    PresentationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SuperTokensAuthGuard,
    },
  ],
})
export class RootModule {}
