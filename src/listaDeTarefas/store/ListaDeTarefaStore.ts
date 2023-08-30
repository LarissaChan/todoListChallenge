import { defineStore } from "pinia";
import type { IListaDeTarefaApiClient } from '../api-client/IListaDeTarefaApiClient';
import type { ItemObtidoResponse } from "../models/ItemObtidoResponse";
import { computed, inject, ref } from "vue";
import type { AdicionarItemRequest } from "../models/AdicionarItemRequest";
import type { AlterarItemRequest } from "../models/AlterarItemRequest";

export const useTarefaStore = defineStore('listaDeTarefas', () => {
  const baseApiClient = inject('IListaDeTarefaApiClient') as IListaDeTarefaApiClient;

  /* State */
  const tarefas = ref<ItemObtidoResponse[]>([]);
  const itemTarefa = ref<ItemObtidoResponse | null>(null);

  /* Getters */
  const tarefasAtivas = computed(() => tarefas.value
    .filter((tarefa: ItemObtidoResponse) => tarefa.estaCompleto));
  
  const tarefaIncompleta = computed(() => tarefas.value
    .filter((tarefa: ItemObtidoResponse) => !tarefa.estaCompleto)
  );

  const todasTarefasCadastradas = computed(() => tarefas.value);

  /* Actions */
  async function obterListaCompleta(): Promise<void> {
    tarefas.value = await baseApiClient.obterListaCompleta();
  };
  
  async function obterTarefaPorId(id: number): Promise<void> {
    itemTarefa.value = await baseApiClient.obterTarefaPorId(id);
  };
      
  async function adicionarItem(tarefa: AdicionarItemRequest): Promise<void> {
    await baseApiClient.adicionarItem(tarefa);
    await obterListaCompleta();
  }
  
  async function alterarItem(id: number, modificacoes: AlterarItemRequest): Promise<void> {
    await baseApiClient.alterarItem(id, modificacoes);
  }
  
  async function excluirTarefa(id: number): Promise<void> {
    await baseApiClient.excluirTarefa(id);
  };
  

  return {
    tarefaIncompleta,
    tarefas,
    tarefasAtivas,
    todasTarefasCadastradas,
    obterListaCompleta,
    obterTarefaPorId,
    adicionarItem,
    alterarItem,
    excluirTarefa,
  };
});
