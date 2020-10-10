import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsDefined, IsEmail, IsOptional, Max, Min } from 'class-validator';
import { BaseColumn } from '../common/classes/base-columns';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, Index, Unique, OneToMany } from 'typeorm';
import { Pessoa } from './pessoa.entity';
import { Categoria } from './categoria.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('planejamentos')
@Unique('uk_pessoa', ['pessoa'])
export class Planejamento extends BaseColumn {

    @ApiProperty()
    @IsOptional()
    @PrimaryGeneratedColumn({ name: 'id_planejamento' })
    id: number;

    @ApiProperty()
    @IsDefined({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, name: 'receita_mensal' })
    receitaMensal: number;

    @ApiProperty()
    @Max(1) // 100%
    @Column({ name: 'percentual_despesa', type: 'decimal', precision: 3, scale: 2, nullable: false, default: 0 })
    percentualDespesa: number;

    @ApiProperty()
    @IsDefined({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @ManyToOne(() => Pessoa, { nullable: false })
    @JoinColumn({ name: 'id_pessoa' })
    pessoa: Pessoa;

    @ApiProperty()
    @OneToMany(() => Categoria, categoria => categoria.planejamento, { cascade: true })
    categorias: Categoria[];

    constructor(data: Omit<Planejamento, 'id'>, id?: number) {
        super();
        Object.assign(this, data);

        if (id) {
            Object.assign(this.id, id);
        }
    }
}
