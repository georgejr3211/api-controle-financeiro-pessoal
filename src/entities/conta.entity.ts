import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsDefined, IsOptional } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseColumn } from '../common/classes/base-columns';
import { InstituicaoFinanceira } from './instituicao-financeira.entity';
import { Pessoa } from './pessoa.entity';
import { TipoConta } from './tipo-conta.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('contas')
export class Conta extends BaseColumn {

    @ApiProperty()
    @IsOptional()
    @PrimaryGeneratedColumn({ name: 'id_conta' })
    id: number;

    @ApiProperty()
    @IsDefined({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @Column({ nullable: false, length: 100 })
    descricao: string;

    @ApiProperty({ type: () => Pessoa })
    @IsDefined({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @ManyToOne(() => Pessoa, { nullable: false })
    @JoinColumn({ name: 'id_pessoa' })
    pessoa: Pessoa;

    @ApiProperty({ type: () => InstituicaoFinanceira })
    @IsDefined({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @ManyToOne(() => InstituicaoFinanceira, { nullable: true })
    @JoinColumn({ name: 'id_instituicao_financeira' })
    instituicaoFinanceira: InstituicaoFinanceira;

    @ApiProperty({ type: () => TipoConta })
    @IsDefined({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @ManyToOne(() => TipoConta, { nullable: false })
    @JoinColumn({ name: 'id_tipo_conta' })
    tipoConta: TipoConta;

    @ApiProperty()
    @IsDefined({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @Column({ nullable: false, default: 1, name: 'incluir_soma' })
    incluirSoma: string;

    constructor(data: Omit<Conta, 'id'>, id?: number) {
        super();
        Object.assign(this, data);

        if (id) {
            Object.assign(this.id, id);
        }
    }
}
