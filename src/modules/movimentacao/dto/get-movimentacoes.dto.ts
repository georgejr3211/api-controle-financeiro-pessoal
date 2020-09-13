import { Categoria } from '../../../entities/categoria.entity';
import { TipoMovimentacao } from '../../../entities/tipo-movimentacao.entity';
export class GetMovimentacoesDto {
    dtLancamento: Date;
    dtVencimento: Date;
    dtConclusao: Date;
    dtLembrete: Date;

    categorias: Categoria[];
    tipoMovimentacao: TipoMovimentacao;
    
    isPago: number;
    isContaFixa: number;
    lembreteEnviado: number;
    isContaAPagar: number;
    isContaAReceber: number;
}