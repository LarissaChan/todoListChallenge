import type { AdicionarItemRequest } from "../models/AdicionarItemRequest";
import type { AlterarItemRequest } from "../models/AlterarItemRequest";
import type { ItemObtidoResponse } from "../models/ItemObtidoResponse";

export interface IListaDeTarefaApiClient {
  adicionarItem(tarefa: AdicionarItemRequest): Promise<any>;
  obterListaCompleta(): Promise<ItemObtidoResponse[]>;
  obterTarefaPorId(id: number): Promise<ItemObtidoResponse>;
  alterarItem(id: number, modificacoes: AlterarItemRequest): Promise<any>;
  excluirTarefa(id: number): Promise<any>;
}