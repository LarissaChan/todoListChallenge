<template>
  <v-container>
    <div>
    <h1>Lista de Tarefas</h1>
  </div>
  <div class="tarefa-adicao__header">
    <label class="mr-3">Descrição:</label>
    <template v-if="estaEditando">
      <v-textarea
        v-model="tarefaParaEditar.nome"
        class="espacamento-button"
        placeholder="Editando tarefa"
        variant="outlined"
        rows="1"
        row-height="15"
      />
      <div style="display:grid">
        <v-btn
          variant="outlined"
          rounded="lg"
          size="small"
          @click="atualizarItem"
        >
          Salvar
        </v-btn>
        <v-btn
          rounded="lg"
          size="small"
          @click="limparEdicao"
        >
          Cancelar
        </v-btn>
      </div>
    </template>
    <template v-else>
      <v-textarea
        v-model="tarefaItem"
        class="espacamento-button"
        placeholder="Insira sua tarefa"
        variant="outlined"
        rows="1"
        row-height="15"
      />
      <v-btn
        variant="outlined"
        rounded="lg"
        size="small"
        @click="adicionarItem"
      >
        Cadastrar
      </v-btn>
    </template>

  </div>

  <v-table>
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Tarefa</th>
        <th scope="col">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(tarefa, index) in listaCompletaDeItens"
        :key="index"
      >
        <td>
          <input type="checkbox" name="checkbox" />
        </td>
        <td>
          <span v-bind:style=" tarefa.estaCompleto ? 'text-decoration: line-through;' : 'text-decoration: none;' ">{{ tarefa.nome }}</span>
        </td>
        <td>
          <v-row class="btn-group">
            <v-col>
              <v-btn
                variant="outlined"
                rounded="lg"
                size="small"
                v-on:click="alterarItem(tarefa.id)"
              >
                Editar
              </v-btn>
              <v-btn
                class="espacamento-button"
                variant="outlined"
                rounded="lg"
                size="small"
                @click="excluirTarefa(tarefa.id)"
              >
                Excluir
              </v-btn>
              <v-btn
                variant="outlined"
                rounded="lg"
                size="small"
                @click="finalizarTarefa(tarefa)"
              >
                {{tarefa.estaCompleto ? 'Desfazer' : 'Finalizar'}}
              </v-btn>
            </v-col>
          </v-row>
        </td>
      </tr>
    </tbody>
  </v-table>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTarefaStore } from '../store/ListaDeTarefaStore'
import type { ItemObtidoResponse } from '../models/ItemObtidoResponse'
import type { AdicionarItemRequest } from '../models/AdicionarItemRequest'

export default {
  setup() {
    const tarefaStore = useTarefaStore()

    const tarefaItem = ref("")
    const tarefaParaEditar = ref({
      id: null,
      nome: null,
      estaCompleto: null,
    })
    const estaEditando = ref(false)
    const tarefaObtida = ref<ItemObtidoResponse>()
  
    // Computed
    const listaCompletaDeItens = computed(() => {
      return tarefaStore.todasTarefasCadastradas.filter(({ id }) => id !== tarefaParaEditar.value.id)
    })
  
    // Methods
    async function adicionarItem(): Promise<void> {
      const tarefaRequest: AdicionarItemRequest = {
        nome: tarefaItem.value,
      };
      await tarefaStore.adicionarItem(tarefaRequest)
      await tarefaStore.obterListaCompleta()
      tarefaItem.value= ''
    }
    
    async function excluirTarefa(id: number) {
      Promise
        .resolve(tarefaStore.excluirTarefa(id))
        .then(async () => await tarefaStore.obterListaCompleta())
    }

    async function finalizarTarefa(tarefa: any) {
      tarefa.estaCompleto = !tarefa.estaCompleto;
      await tarefaStore.alterarItem(tarefa.id, tarefa);
      await tarefaStore.obterListaCompleta();
      limparEdicao();
    }

    function alterarItem(id: number) {
      const [item] = tarefaStore
      .todasTarefasCadastradas
      .filter((tarefa) => tarefa.id === id)
      Object.assign(tarefaParaEditar.value, item)
      estaEditando.value = true
    }

    async function atualizarItem() {
      try {
        await tarefaStore.alterarItem(
          tarefaParaEditar.value.id,
          {
            nome: tarefaParaEditar.value.nome,
            estaCompleto: tarefaParaEditar.value.estaCompleto
          });
        await tarefaStore.obterListaCompleta();
        limparEdicao();
      } catch (error) {
        console.error("Erro ao atualizar a tarefa:", error);
      }
    }

    function limparEdicao() {
      tarefaParaEditar.value = {
        id: null,
        nome: null,
        estaCompleto: null
      };
      estaEditando.value = false;
    }

    onMounted(async () => {
      await tarefaStore.obterListaCompleta();
    });

    return {
    tarefaStore,
    tarefaItem,
    tarefaObtida,
    adicionarItem,
    excluirTarefa,
    finalizarTarefa,
    alterarItem,
    estaEditando,
    tarefaParaEditar,
    atualizarItem,
    limparEdicao,
    listaCompletaDeItens,
    }
  }, 
}
</script>

<style scoped>
.tarefa-adicao__header {
  display: flex;
}

.espacamento-button {
  margin: 0 10px;
  max-width: 35vw;
  min-width: 20px;
}
</style>