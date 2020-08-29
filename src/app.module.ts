import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EasyconfigModule } from 'nestjs-easyconfig';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './common/guards/auth.guard';
import { CronModule } from './crons/cron.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { MovimentacaoModule } from './modules/movimentacao/movimentacao.module';
import { ParcelaModule } from './modules/parcela/parcela.module';
import { PessoaModule } from './modules/pessoa/pessoa.module';
import { TipoMovimentacaoModule } from './modules/tipo-movimentacao/tipo-movimentacao.module';
import { UsuarioModule } from './modules/usuario/usuario.module';

@Module({
  imports: [
    EasyconfigModule.register({}),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      autoLoadEntities: true,
      synchronize: Number(process.env.SYNCHRONIZE) ? true : false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UsuarioModule,
    PessoaModule,
    MovimentacaoModule,
    CategoriaModule,
    TipoMovimentacaoModule,
    ParcelaModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AppModule { }
