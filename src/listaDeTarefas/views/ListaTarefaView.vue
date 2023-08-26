<template>
  <v-container class="tarefas-app">
    <h1>Lista de Tarefas</h1>
    <tarefaAdicao />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TarefaAdicao from "../components/TarefaAdicao.vue";

export default defineComponent({
  components: { TarefaAdicao },
  setup() {
    return {};
  },
});
</script>