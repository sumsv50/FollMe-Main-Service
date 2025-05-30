import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StoriesModule } from './modules/stories/stories.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './modules/blogs/blogs.module';
import { ProfileModule } from './modules/profiles/profile.module';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { GetUserInfoInterceptor } from './interceptors/getUserInfo.interceptor';
import { LogService } from './modules/logsConfig/logs.service';
import { Log, LogSchema } from './modules/logsConfig/schemas/log.schema';
import { User, UserSchema } from './modules/auth/schemas/user.schema';
import { AllExceptionsFilter } from './allException.filter';
import { InvitationModule } from './modules/invitation/invitations.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_HOST),
    StoriesModule,
    BlogsModule,
    AuthModule,
    ProfileModule,
    InvitationModule,
    MongooseModule.forFeatureAsync([
      {
        name: Log.name,
        useFactory: () => {
          const schema = LogSchema;
          schema.plugin(require('mongoose-slug-updater'));
          return schema;
        },
      }
    ]),
    MongooseModule.forFeatureAsync([
      {
          name: User.name,
          useFactory: () => {
              const schema = UserSchema;
              schema.plugin(require('mongoose-slug-updater'));
              return schema;
          },
      }
  ]),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GetUserInfoInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    LogService,
    JwtService
  ],
})
export class AppModule { }
