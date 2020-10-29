import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsDefined, IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseColumn } from '../common/classes/base-columns';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('instituicoes_financeiras')
export class InstituicaoFinanceira extends BaseColumn {

    @ApiProperty()
    @IsOptional()
    @PrimaryGeneratedColumn({ name: 'id_instituicao_financeira' })
    id: number;

    @ApiProperty()
    @IsDefined({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @Column({ nullable: false, length: 80 })
    descricao: string;

    constructor(data: Omit<InstituicaoFinanceira, 'id'>, id?: number) {
        super();
        Object.assign(this, data);

        if (id) {
            Object.assign(this.id, id);
        }
    }
}
