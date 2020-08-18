import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsDefined, IsOptional } from 'class-validator';
import * as moment from 'moment-timezone';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseColumn } from '../common/classes/base-columns';
import { Categoria } from './categoria.entity';
import { Pessoa } from './pessoa.entity';
import { TipoMovimentacao } from './tipo-movimentacao.entity';

const { CREATE, UPDATE } = CrudValidationGroups;
@Entity('movimentacoes')
export class Movimentacao extends BaseColumn {

  @ApiProperty()
  @IsOptional()
  @PrimaryGeneratedColumn({ name: 'id_movimentacao' })
  id: number;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total: number;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ length: 150, nullable: false })
  descricao: string;

  @ApiProperty()
  @IsOptional()
  @Column({ nullable: true, name: 'dt_conclusao' })
  dtConclusao: Date;

  @ApiProperty()
  @IsOptional()
  @Column({ type: 'date', nullable: false, name: 'dt_lancamento', default: moment.tz(new Date(), process.env.TIMEZONE).format('YYYY-MM-DD') })
  dtLancamento: Date;

  @ApiProperty()
  @IsOptional()
  @Column({ type: 'smallint', nullable: false, default: 0 })
  pago: number;

  // RELATIONS
  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @ManyToOne(() => Categoria, { nullable: false, cascade: true })
  @JoinColumn({ name: 'id_categoria' })
  categoria: Categoria;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @ManyToOne(() => TipoMovimentacao, { nullable: false })
  @JoinColumn({ name: 'id_tipo_movimentacao' })
  tipoMovimentacao: TipoMovimentacao;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @ManyToOne(() => Pessoa, { nullable: false })
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  constructor(data: Omit<Movimentacao, 'id'>, id?: number) {
    super();
    Object.assign(this, data);

    if (id) {
      Object.assign(this.id, id);
    }
  }
}
