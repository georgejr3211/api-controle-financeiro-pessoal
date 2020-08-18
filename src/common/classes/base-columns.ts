import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Column, CreateDateColumn } from 'typeorm';

export class BaseColumn {
  @ApiProperty()
  @IsOptional()
  @Column({ type: 'smallint', nullable: false, default: 1 })
  status?: number;

  @CreateDateColumn({ name: 'dt_cadastro', nullable: false })
  dtCadastro?: Date;

  @CreateDateColumn({ name: 'dt_alteracao', nullable: false })
  dtAlteracao?: Date;
}