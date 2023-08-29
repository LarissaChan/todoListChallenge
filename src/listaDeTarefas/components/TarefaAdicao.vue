(<template>
  <div class="tarefa-adicao__header">
    <label class="mr-3">Descrição:</label>
    <template v-if="estaEditando">
      <v-textarea
        v-model="tarefaParaEditar.nome"
        class="tarefa-adicao__input"
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
        class="tarefa-adicao__input"
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
        v-for="(tarefa, index) in listaFiltradaSemItemEmEdicao"
        :key="index"
      >
        <td>
          <input type="checkbox" name="checkbox" />
        </td>
        <td>
          <span>{{ tarefa.nome }}</span>
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
              >
                Finalizar
              </v-btn>
            </v-col>
          </v-row>
        </td>
      </tr>
    </tbody>
  </v-table>
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
    const loadings = tarefaStore.loadings

    // Computed
    const listaFiltradaSemItemEmEdicao = computed(() => {
      return tarefaStore.tarefaIncompleta.filter(({ id }) => id !== tarefaParaEditar.value.id)
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
    function alterarItem(id: number) {
      const [item] = tarefaStore
        .tarefaIncompleta
        .filter((tarefa) => tarefa.id === id)

      Object.assign(tarefaParaEditar.value, item)
      estaEditando.value = true
    }
    async function atualizarItem() {
      Promise
        .resolve(tarefaStore.alterarItem(tarefaParaEditar.value))
        .then(async () => await tarefaStore.obterListaCompleta())
        .finally(() => {
          estaEditando.value = false
        })
    }
    async function limparEdicao() {
      Object
        .keys(tarefaParaEditar.value)
        .forEach((key) => {
          tarefaParaEditar.value[key] = null
        })
      estaEditando.value = false
    }

    onMounted(async () => {
      await tarefaStore.obterListaCompleta();
    });

    return {
      tarefaStore,
      tarefaItem,
      tarefaObtida,
      loadings,
      adicionarItem,
      excluirTarefa,
      alterarItem,
      estaEditando,
      tarefaParaEditar,
      atualizarItem,
      limparEdicao,
      listaFiltradaSemItemEmEdicao,
    }
  },
}
</script>

<style scoped>
.tarefa-adicao__header {
  display: flex;
}

.tarefa-adicao__input {
  margin: 0 10px;

  max-width: 35vw;
  min-width: 20px;
}

/* .tarefa-adicao {
  &__header {
    display: flex;
  }
} */
</style>)