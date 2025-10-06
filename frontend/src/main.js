import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Menu from 'primevue/menu'

// PrimeVue CSS
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'


import App from './App.vue'
import router from './router'

const app = createApp(App)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('MultiSelect', MultiSelect)
app.component('Dropdown', Dropdown)
app.component('Calendar', Calendar)
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Menu', Column);


app.use(createPinia())
app.use(router)
app.use(PrimeVue);

app.mount('#app')
