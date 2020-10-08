import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsDefined, IsEmail, IsOptional } from 'class-validator';
import { BaseColumn } from '../common/classes/base-columns';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, Index, Unique } from 'typeorm';
import { Pessoa } from './pessoa.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('tarefas')
export class Tarefa extends BaseColumn {

  @ApiProperty()
  @IsOptional()
  @PrimaryGeneratedColumn({ name: 'id_tarefa' })
  id: number;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ length: 150, nullable: false })
  descricao: string;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ nullable: false, default: false })
  concluido: boolean;

  @ApiProperty()
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @ManyToOne(() => Pessoa, { nullable: false })
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  constructor(data: Omit<Tarefa, 'id'>, id?: number) {
    super();
    Object.assign(this, data);

    if (id) {
      Object.assign(this.id, id);
    }
  }
}
