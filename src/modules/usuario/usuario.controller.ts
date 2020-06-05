import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';

import { Public } from '../../common/decorators/public.decorator';
import { verifyToken } from '../../common/utils/jwt';
import { LoginDto } from '../../dtos/login.dto';
import { ResetPasswordDto } from '../../dtos/reset-password.dto';
import { Usuario } from '../../entities/usuario.entity';
import { UsuarioService } from './usuario.service';

@Crud({
  model: {
    type: Usuario,
  },
  routes: {
    exclude: ['createManyBase', 'createOneBase', 'updateOneBase', 'replaceOneBase', 'deleteOneBase', 'getManyBase', 'getOneBase'],
  },
  query: {
    join: {
      pessoa: { eager: true },
    },
    alwaysPaginate: true,
    maxLimit: 10,
    sort: [{ field: 'id', order: 'DESC' }],
  },
})
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) { }

  @Post('cadastro')
  @Public()
  async onRegister(@Body() dto: Usuario) {
    const result = await this.service.onRegister(dto);

    return result;
  }

  @Post('login')
  @Public()
  async onLogin(@Body() dto: LoginDto) {
    const result = await this.service.onLogin(dto);

    return result;
  }

  @Post('recuperar-senha')
  @Public()
  async forgotPassword(@Body('email') email: string) {
    const result = await this.service.forgotPassword(email);

    return result;
  }

  @Post('resetar-senha')
  @Public()
  async resetPassword(@Body() data: ResetPasswordDto) {
    const result = await this.service.resetPassword(data.email, data.senha, data.codigo);

    return result;
  }

  @Get('confirmar-email')
  @Public()
  async onConfirm(@Query('token') token) {
    const usuario: Usuario = verifyToken(token);
    const result = await this.service.onConfirm(usuario.email);

    return result;
  }
}
