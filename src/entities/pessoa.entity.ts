import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsDefined, IsOptional } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseColumn } from '../common/classes/base-columns';
import { Usuario } from './usuario.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('pessoas')
export class Pessoa extends BaseColumn {

  @IsOptional()
  @PrimaryGeneratedColumn({ name: 'id_pessoa' })
  id: number;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ length: 80, nullable: false })
  nome: string;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ length: 80, nullable: false })
  sobrenome: string;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ name: 'dt_nascimento', type: 'date', nullable: false })
  dtNascimento: Date;

  @OneToOne(() => Usuario, usuario => usuario.pessoa, { nullable: false })
  usuario: Usuario;
}
