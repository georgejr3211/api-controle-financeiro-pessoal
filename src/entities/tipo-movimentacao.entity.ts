import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsDefined, IsEmail, IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseColumn } from '../common/classes/base-columns';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('tipos_movimentacao')
export class TipoMovimentacao extends BaseColumn {

  @IsOptional()
  @PrimaryGeneratedColumn({ name: 'id_tipo_movimentacao' })
  id?: number;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ length: 30, nullable: false, unique: true })
  descricao?: string;

}
