import { IsDefined, IsOptional } from 'class-validator';

export class QueryDto {
    @IsDefined()
    pessoaId!: number;

    @IsOptional()
    offset?: number = 0;

    @IsOptional()
    limit?: number = 10;

    @IsOptional()
    search?: string;
}