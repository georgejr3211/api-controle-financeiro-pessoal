import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { MENSAGENS } from '../../common/enums/mensagens';
import { sendEmail } from '../../common/utils/email';
import { createToken } from '../../common/utils/jwt';
import { compare, hash } from '../../common/utils/password';
import { LoginDto } from '../../dtos/login.dto';
import { Usuario } from '../../entities/usuario.entity';
import { In } from 'typeorm';

@Injectable()
export class UsuarioService extends TypeOrmCrudService<Usuario> {
  constructor(@InjectRepository(Usuario) repo) {
    super(repo);
  }

  async findEmail(email: string, status?: number[]) {
    const parametros: any = {};
    parametros.email = email;
    if (status) {
      parametros.status = In(status);
    }

    const usuario = await this.repo.createQueryBuilder('usuario')
      .innerJoinAndSelect('usuario.pessoa', 'pessoa')
      .where(parametros)
      .getOne();

    return usuario;
  }

  async onRegister(data: Usuario) {
    const userEmail = await this.findEmail(data.email);

    if (userEmail) {
      throw new HttpException(MENSAGENS.EMAIL_DUPLICADO, HttpStatus.BAD_REQUEST);
    }

    if (!data.senha) {
      throw new HttpException(MENSAGENS.SENHA_NAO_INFORMADA, HttpStatus.BAD_REQUEST);
    }

    data.senha = hash(data.senha);

    const result = await this.repo.save(data);

    if (result) {
      const token = createToken({ ...result });
      const html = `<a href="${process.env.API_BASE_URL}/usuarios/confirmar-email?token=${token}">Confirmar cadastro</a>`;
      await sendEmail(result.email, 'Confirmação de cadastro', html, html);
    }

    return { data: result };
  }

  async onLogin(data: LoginDto) {
    const { senha, email } = data;

    const usuario: Usuario = await this.findEmail(email, [1]);

    if (!usuario) {
      throw new HttpException(MENSAGENS.REGISTRO_NAO_ENCONTRADO, HttpStatus.NO_CONTENT);
    }

    const token = createToken({ ...usuario });

    if (!usuario.emailVerificado) {
      const html = `<a href="${process.env.API_BASE_URL}/usuarios/confirmar-email?token=${token}">Confirmar cadastro</a>`;
      await sendEmail(usuario.email, 'Confirmação de cadastro', html, html);
      throw new HttpException(MENSAGENS.EMAIL_NAO_CONFIRMADO, HttpStatus.NO_CONTENT);
    }

    const samePassword = compare(senha, usuario.senha);

    if (!samePassword) {
      throw new HttpException(MENSAGENS.SENHA_INCORRETA, HttpStatus.BAD_REQUEST);
    }

    return { data: usuario, token };
  }

  async onConfirm(email: string) {
    const usuario = await this.findEmail(email);

    if (!usuario) {
      throw new HttpException(MENSAGENS.REGISTRO_NAO_ENCONTRADO, HttpStatus.NO_CONTENT);
    }

    if (usuario.emailVerificado === 1) {
      throw new HttpException(MENSAGENS.EMAIL_CONFIRMADO, HttpStatus.BAD_REQUEST);
    }

    usuario.status = 1;
    usuario.emailVerificado = 1;
    usuario.pessoa.status = 1;

    await this.repo.save(usuario);

    return { data: 'Email confirmado com sucesso' };
  }

  async forgotPassword(email: string) {
    const usuario = await this.findEmail(email);

    if (!usuario) {
      throw new HttpException(MENSAGENS.REGISTRO_NAO_ENCONTRADO, HttpStatus.NO_CONTENT);
    }

    usuario.codigoRecuperacao = Math.floor(Math.random() * (+9999 - +3333)) + +3333;

    await this.repo.save(usuario);

    const html = `<h1>Código de confirmação: ${usuario.codigoRecuperacao}</h1>`;
    await sendEmail(usuario.email, 'Esqueci minha senha', html, html);

    return { data: 'E-mail enviado com sucesso' };
  }

  async resetPassword(email: string, senha: string, codigo: number) {
    const usuario = await this.findEmail(email);

    if (!usuario) {
      throw new HttpException(MENSAGENS.REGISTRO_NAO_ENCONTRADO, HttpStatus.NO_CONTENT);
    }

    if (usuario.codigoRecuperacao !== codigo) {
      throw new HttpException(MENSAGENS.CODIGO_INVALIDO, HttpStatus.BAD_REQUEST);
    }

    usuario.senha = hash(senha);
    usuario.codigoRecuperacao = null;

    await this.repo.save(usuario);

    return { data: 'Senha resetada com sucesso' };
  }

}
