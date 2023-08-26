import './_shared/base/assets/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Vuetify
import {createVuetify} from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import Provider from './_shared/ioc/Provider';

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
});

for (const factory of Provider) {
  app.provide(factory.key, factory.provider);
}

const pinia = createPinia();
app.use(pinia);
app.use(vuetify)

app.mount('#app')
