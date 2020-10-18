import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsDefined, IsOptional } from 'class-validator';
import * as moment from 'moment-timezone';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseColumn } from '../common/classes/base-columns';
import { Movimentacao } from './movimentacao.entity';
import { Pessoa } from './pessoa.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('objetivos')
export class Objetivo extends BaseColumn {

    @ApiProperty()
    @IsOptional()
    @PrimaryGeneratedColumn({ name: 'id_objetivo' })
    id: number;

    @ApiProperty()
    @IsDefined({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @Column({ nullable: false, length: 100 })
    descricao: string;

    @ApiProperty()
    @IsDefined({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    total: number;

    @ApiProperty()
    @IsOptional()
    @Column({ type: 'date', nullable: false, name: 'dt_conclusao', default: moment.tz(new Date(), process.env.TIMEZONE).format('YYYY-MM-DD') })
    dtConclusao: Date;

    @ApiProperty({ type: () => Pessoa })
    @IsDefined({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @ManyToOne(() => Pessoa, { nullable: false })
    @JoinColumn({ name: 'id_pessoa' })
    pessoa: Pessoa;

    @ApiProperty({ type: () => Movimentacao })
    @OneToMany(() => Movimentacao, movimentacao => movimentacao.objetivo)
    movimentacoes: Movimentacao[];

    constructor(data: Omit<Objetivo, 'id'>, id?: number) {
        super();
        Object.assign(this, data);

        if (id) {
            Object.assign(this.id, id);
        }
    }
}
