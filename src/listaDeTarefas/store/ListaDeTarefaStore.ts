import { defineStore } from "pinia";
import type { IListaDeTarefaApiClient } from '../api-client/IListaDeTarefaApiClient';
import type { ItemObtidoResponse } from "../models/ItemObtidoResponse";
import { computed, inject, ref } from "vue";
import type { AdicionarItemRequest } from "../models/AdicionarItemRequest";
import type { AlterarItemRequest } from "../models/AlterarItemRequest";
type Loadings = {
  obterTarefaPorId: boolean,
  adicionarItem: boolean,
}

export const useTarefaStore = defineStore('listaDeTarefas', () => {
  const baseApiClient = inject('IListaDeTarefaApiClient') as IListaDeTarefaApiClient;

  /* State */
  const loadings = ref<Loadings>({
    obterTarefaPorId: false,
    adicionarItem: false,
  });
  const tarefas = ref<ItemObtidoResponse[]>([]);
  const itemTarefa = ref<ItemObtidoResponse | null>(null);

  /* Getters */
   const tarefasAtivas = computed(() => tarefas.value
    .filter((tarefa: ItemObtidoResponse) => tarefa.estaCompleto));

  const tarefaCompleta = computed(() =>
  tarefas.value.filter(Boolean)
  );
  
  const tarefaIncompleta = computed(() =>
  tarefas.value.filter((tarefa) => !tarefa.estaCompleto)
  );

  /* Actions */
  async function obterListaCompleta(): Promise<void> {
    tarefas.value = await baseApiClient.obterListaCompleta();
  };
  
  async function obterTarefaPorId(id: number): Promise<void> {
    if (!loadings.value.obterTarefaPorId) {
        try {
            loadings.value.obterTarefaPorId = true;
            itemTarefa.value = await baseApiClient.obterTarefaPorId(id);
        } finally {
            loadings.value.obterTarefaPorId = false;
        }
      }
    };
      
  async function adicionarItem(tarefa: AdicionarItemRequest): Promise<void> {
    if (!loadings.value.adicionarItem) {
      try {
        loadings.value.adicionarItem = true;
        await baseApiClient.adicionarItem(tarefa);
        await obterListaCompleta();
      } finally {
        loadings.value.adicionarItem = false;
      }
    }
  }
  
  async function alterarItem(tarefa: ItemObtidoResponse): Promise<void> {
    const tarefaModificada: AlterarItemRequest = {
      id: tarefa.id,
      nome: tarefa.nome,
      estaCompleto: tarefa.estaCompleto
    };
    await baseApiClient.alterarItem(tarefaModificada);
    await obterListaCompleta();
  }
  
  async function excluirTarefa(id: number): Promise<void> {
    await baseApiClient.excluirTarefa(id);
  };    

  return {
    tarefaCompleta,
    tarefaIncompleta,
    tarefas,
    loadings,
    tarefasAtivas,
    obterListaCompleta,
    obterTarefaPorId,
    adicionarItem,
    alterarItem,
    excluirTarefa,
  };
});
