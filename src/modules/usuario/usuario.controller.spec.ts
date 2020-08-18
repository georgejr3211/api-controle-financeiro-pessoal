import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pessoa } from '../../entities/pessoa.entity';
import { Usuario } from '../../entities/usuario.entity';
import { createTestConfiguration } from './../../config/test.database';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

describe('Usuario Controller', () => {
  let controller: UsuarioController;
  let repository: Repository<Usuario>;
  let pessoaRepository: Repository<Pessoa>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([Usuario, Pessoa]),
      ],
      controllers: [UsuarioController],
      providers: [UsuarioService],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    pessoaRepository = module.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const pessoa = new Pessoa();
    pessoa.dtNascimento = new Date('2020-06-04');
    pessoa.nome = 'Daniela';
    pessoa.sobrenome = 'Almada';
    await pessoaRepository.save(pessoa);

    const usuario = new Usuario();
    usuario.email = 'ingrid-zardo@tuamaeaquelaursa.com';
    usuario.senha = '12345678';
    usuario.pessoa = pessoa;

    const result = await controller.onRegister(usuario);

    expect(result).toHaveProperty('data');

  });

  it('should confirm email', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOjAsImR0Q2FkYXN0cm8iOiIyMDIwLTA2LTA1VDAxOjA2OjAzLjAwMFoiLCJkdEFsdGVyYWNhbyI6IjIwMjAtMDYtMDVUMDE6MDY6MDMuMDAwWiIsImlkIjoxLCJlbWFpbCI6ImluZ3JpZC16YXJkb0B0dWFtYWVhcXVlbGF1cnNhLmNvbSIsInNlbmhhIjoiJDJhJDE1JDdXNTl3azFYVG0ubWlOc29SZUVRMHV0TWNPRHU0LnZ1aDhtdG5aNVFOVDVPRUNIbDhuSkNDIiwiZW1haWxWZXJpZmljYWRvIjowLCJjb2RpZ29SZWN1cGVyYWNhbyI6bnVsbCwiaWF0IjoxNTkxMzE5MTY3fQ.59zRqUrxRoJKeWpQDIZwCGtf3_O3GjVYn5o96nmCaUw';

    const result = await controller.onConfirm(token);

    expect(result).toHaveProperty('data');
  });

  it('should login', async () => {
    const email = 'ingrid-zardo@tuamaeaquelaursa.com';
    const senha = '12345678';

    const result = await controller.onLogin({ email, senha });

    expect(result).toHaveProperty('data');
  });

  it('should recovery password', async () => {
    const email = 'ingrid-zardo@tuamaeaquelaursa.com';

    const result = await controller.forgotPassword(email);

    expect(result).toHaveProperty('data');
  });

  it('should reset password', async () => {
    const email = 'ingrid-zardo@tuamaeaquelaursa.com';
    const senha = '12345678';

    const usuario = await repository.findOne({ email });

    const result = await controller.resetPassword({ codigo: usuario.codigoRecuperacao, email, senha });

    expect(result).toHaveProperty('data');
  });

});
