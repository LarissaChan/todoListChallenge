import type { IListaDeTarefaApiClient } from "./IListaDeTarefaApiClient";
import type { AdicionarItemRequest } from "../models/AdicionarItemRequest";
import type { ItemObtidoResponse } from "../models/ItemObtidoResponse";
import type { AlterarItemRequest } from "../models/AlterarItemRequest";
import type { IBaseApiClient } from "@/_shared/api-client/IBaseApiClient";

export class ListaDeTarefaApiClient implements IListaDeTarefaApiClient {
  private readonly baseApiClient: IBaseApiClient;

  constructor(baseApiClient: IBaseApiClient) {
    this.baseApiClient = baseApiClient;
  }

  public async obterListaCompleta(): Promise<ItemObtidoResponse[]> {
    const response = await this.baseApiClient.get<ItemObtidoResponse[]>("/api/TodoItems");
    console.log("lista completa", response);
    return response;
  }

  public async obterTarefaPorId(id: number): Promise<ItemObtidoResponse> {
    const response = await this.baseApiClient.get<ItemObtidoResponse>(`/api/TodoItems/${id}`);
    return response;
  }

  public async adicionarItem(tarefa: AdicionarItemRequest): Promise<any> {
    const response = await this.baseApiClient.post("/api/TodoItems/addItem", tarefa);
    return response;
  }

  public async alterarItem(tarefa: AlterarItemRequest): Promise<any> {
    const response = await this.baseApiClient.put("/api/TodoItems", tarefa);
    return response;
  }

  public async excluirTarefa(id: number): Promise<any> {
    const response = await this.baseApiClient.delete(`/api/TodoItems/${id}`, null);
    return response;
  }
}
