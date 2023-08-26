<template>
  <div>
    <header>
      <div>
        <nav>
        </nav>
      </div>
    </header>
    <ListaTarefaView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ListaTarefaView from './listaDeTarefas/views/ListaTarefaView.vue';

export default defineComponent({
    name: 'App',
    components: { ListaTarefaView }
});
</script>