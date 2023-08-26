import { defineStore } from "pinia";
import type { IListaDeTarefaApiClient } from '../api-client/IListaDeTarefaApiClient';
import type { ItemObtidoResponse } from "../models/ItemObtidoResponse";
import { computed, inject, ref } from "vue";
import type { AdicionarItemRequest } from "../models/AdicionarItemRequest";
import type { AlterarItemRequest } from "../models/AlterarItemRequest";
type Loadings = {
  obterListaCompleta: boolean,
  obterTarefaPorId: boolean,
  adicionarItem: boolean,
  alterarItem: boolean,
  excluirTarefa: boolean,
}

export const useTarefaStore = defineStore('listaDeTarefas', () => {
  const baseApiClient = inject('IListaDeTarefaApiClient') as IListaDeTarefaApiClient;

  /* State */
  const loadings = ref<Loadings>({
    obterListaCompleta: true,
    obterTarefaPorId: false,
    adicionarItem: false,
    alterarItem: false,
    excluirTarefa: false,
  });
  const tarefas = ref<ItemObtidoResponse[]>([]);
  const itemTarefa = ref<ItemObtidoResponse | null>(null);

  /* Getters */
/*   const tarefasAtivas = computed(() => tarefas.value
    .filter((tarefa: ItemObtidoResponse) => tarefa.estaCompleto)); */

  const tarefaCompleta = computed(() =>
  tarefas.value.filter((tarefa) => tarefa.estaCompleto === true)
  );
  const tarefaImcompleta = computed(() =>
  tarefas.value.filter((tarefa) => tarefa.estaCompleto !== true)
  );

  /* Actions */
  async function obterListaCompleta(): Promise<void> {
    if (!loadings.value.obterListaCompleta) {
        try {
            loadings.value.obterListaCompleta = true;
            tarefas.value = await baseApiClient.obterListaCompleta();
            console.log("teste store", tarefas.value)
        } finally {
            loadings.value.obterListaCompleta = false;
        }
    }
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

/*   async function adicionarItem(tarefa: AdicionarItemRequest): Promise<void> {
    await baseApiClient.adicionarItem(tarefa);
      }; */
      
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
    if (!loadings.value.alterarItem) {
      try {
        loadings.value.alterarItem = true;
        const tarefaModificada: AlterarItemRequest = {
          id: tarefa.id,
          nome: tarefa.nome,
          estaCompleto: tarefa.estaCompleto
        };
        await baseApiClient.alterarItem(tarefaModificada);
        await obterListaCompleta();
      } finally {
        loadings.value.alterarItem = false;
      }
    }
  }
  
  async function excluirTarefa(id: number): Promise<void> {
    tarefas.value = tarefas.value.filter((tarefa) => tarefa.id !== id);
    await baseApiClient.excluirTarefa(id);
/*     if (!loadings.value.excluirTarefa) {
      try {
        loadings.value.excluirTarefa = true;
        await baseApiClient.excluirTarefa(id);
        tarefas.value = tarefas.value.filter(tarefa => tarefa.id !== id);
      } finally {
        loadings.value.excluirTarefa = false;
      }
    } */
  };    

  return {
    tarefaCompleta,
    tarefaImcompleta,
    loadings,
    tarefasAtivas,
    obterListaCompleta,
    obterTarefaPorId,
    adicionarItem,
    alterarItem,
    excluirTarefa,
  };
});
