(<template>
  <v-container>
    <v-row>
      <v-col cols="5">
      <v-row>
        <label>Descrição:&nbsp;</label>
        <v-textarea
          placeholder="Insira sua tarefa"
          variant="outlined"
          rows="1"
          row-height="15"
          v-model="tarefaItem"
        ></v-textarea>
        <v-btn
          variant="outlined"
          rounded="lg"
          size="small"
          @click="adicionarItem"
          > Cadastrar
        </v-btn>
      </v-row>
    </v-col>
    </v-row> 
    <v-table>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Tarefa</th>
          <th scope="col">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tarefa, index) in tarefaStore.tarefaImcompleta" :key="index">
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
                  v-on:click="alterarItem(tarefa)"
                >
                  Editar</v-btn
                >
                <v-btn
                  variant="outlined"
                  rounded="lg"
                  size="small"
                  v-on:click="excluirTarefa(index)"
                >
                  Excluir</v-btn
                >
                <v-btn variant="outlined" rounded="lg" size="small"> Finalizar</v-btn>
              </v-col>
            </v-row>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useTarefaStore } from '../store/ListaDeTarefaStore'
import type { ItemObtidoResponse } from '../models/ItemObtidoResponse'
import type { AdicionarItemRequest } from '../models/AdicionarItemRequest'

export default {
  setup() {
    const tarefaStore = useTarefaStore()

    const tarefaItem = ref("")
    const tarefaObtida = ref<ItemObtidoResponse>()
    const loadings = tarefaStore.loadings

     async function adicionarItem(): Promise<void> {
      const tarefaRequest: AdicionarItemRequest = {
        nome: tarefaItem.value,
      };
      await tarefaStore.adicionarItem(tarefaRequest)
      await tarefaStore.obterListaCompleta()
      tarefaItem.value= ''
    }

    function excluirTarefa(index: number) {
      const tarefaExcluida = tarefaStore.tarefasAtivas[index]
      tarefaStore.excluirTarefa(tarefaExcluida.id)
    }

    function alterarItem(tarefa: any) {
      tarefaStore.alterarItem(tarefa)
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
    }
  },
}
</script>
)