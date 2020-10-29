import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsDefined, IsEmail, IsOptional } from 'class-validator';
import { BaseColumn } from '../common/classes/base-columns';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, Index, Unique } from 'typeorm';
import { Pessoa } from './pessoa.entity';
import { Planejamento } from './planejamento.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('categorias')
@Unique('uk_descricao_pessoa', ['descricao', 'pessoa'])
export class Categoria extends BaseColumn {

  @ApiProperty()
  @IsOptional()
  @PrimaryGeneratedColumn({ name: 'id_categoria' })
  id: number;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ length: 45, nullable: false })
  descricao: string;

  @ApiProperty()
  @IsOptional()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, })
  limite: number;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @ManyToOne(() => Pessoa, { nullable: false })
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  @ApiProperty()
  @IsOptional()
  @ManyToOne(() => Planejamento, { nullable: true })
  @JoinColumn({ name: 'id_planejamento' })
  planejamento: Planejamento;

  constructor(data: Omit<Categoria, 'id'>, id?: number) {
    super();
    Object.assign(this, data);

    if (id) {
      Object.assign(this.id, id);
    }
  }
}
