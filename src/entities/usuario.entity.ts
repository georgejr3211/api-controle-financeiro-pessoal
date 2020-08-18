import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsDefined, IsEmail, IsOptional } from 'class-validator';
import { BaseColumn } from '../common/classes/base-columns';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Pessoa } from './pessoa.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('usuarios')
export class Usuario extends BaseColumn {

  @IsOptional()
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id: number;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ length: 145, nullable: false, unique: true })
  email: string;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ length: 255, nullable: false })
  senha: string;

  @ApiProperty()
  @IsOptional({ groups: [UPDATE] })
  @Column({ name: 'email_verificado', type: 'smallint', nullable: false, default: 0 })
  emailVerificado: number;

  @ApiProperty()
  @IsOptional({ groups: [UPDATE] })
  @Column({ name: 'codigo_recuperacao', type: 'int', nullable: true })
  codigoRecuperacao: number;

  @ApiProperty()
  @IsOptional()
  @Column({ type: 'smallint', nullable: false, default: 0 })
  status?: number;

  @IsOptional()
  @OneToOne(() => Pessoa, { nullable: false, cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;
}
