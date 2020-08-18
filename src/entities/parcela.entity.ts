import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsDefined, IsOptional } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseColumn } from '../common/classes/base-columns';
import { Movimentacao } from './movimentacao.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('parcelas')
export class Parcela extends BaseColumn {

  @IsOptional()
  @PrimaryGeneratedColumn({ name: 'id_parcela' })
  id: number;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total: number;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'date', nullable: false, name: 'dt_vencimento' })
  dtVencimento: Date;

  @IsOptional()
  @Column({ type: 'date', name: 'dt_conclusao', nullable: true })
  dtConclusao: Date;

  @IsOptional()
  @Column({ type: 'smallint', nullable: false, default: 0 })
  pago: number;

  // RELATIONS
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @ManyToOne(() => Movimentacao, { nullable: false })
  @JoinColumn({ name: 'id_movimentacao' })
  movimentacao: Movimentacao;
}
