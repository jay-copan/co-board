import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
// OPTIONAL (recommended for prod)
// import { ThrottlerStorageRedisService } from '@nestjs/throttler-storage-redis';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    ConfigModule.forRoot({ isGlobal: true }),

    /* ===========================
       RATE LIMITER (GLOBAL)
       =========================== */
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => ({
        ttl: 60, // ⬅️ REQUIRED for global limiter
        limit: 5, // ⬅️ REQUIRED for global limiter

        throttlers: [
          {
            name: 'auth',
            ttl: 60,
            limit: 5,
          },
        ],

        // ✅ Uncomment this block for production (Redis)
        /*
        storage: new ThrottlerStorageRedisService({
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        }),
        */
      }),
    }),

    /* ===========================
       MONGOOSE
       =========================== */
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error('MONGO_URI is not defined');
        }
        return { uri };
      },
    }),

    AuthModule,
  ],

  /* ===========================
     GLOBAL GUARD
     =========================== */
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
