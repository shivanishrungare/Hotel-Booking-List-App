<template>
  <div class="hotel-web-app">
    <header>
      <nav class="navbar">
        <img src="../assets/trivago-logo.svg" alt='logo' class='logo'/>
        <h1>Business Studio</h1>
      </nav>
      </header>

      <div class="table-view-container">
        <div class="table-title">Hotel Booking Overview</div>
        <div class="table-actions">
          <div class="create-search-options">
          <Button class="custom-btn"  @click="openDialog(FormContainer)" ><i class="pi pi-plus-circle"></i></Button>
           <Dialog
            v-model:visible="isVisible"
            header="Create new booking"
            modal
          >
            <component
              :is="currentComponent"
              
            />
          </Dialog>
          <InputText class="search-input" placeholder="Search for Hotel or booking no."></InputText>
          </div>
         
          
          <div class="filter-options">
          <div>
          <MultiSelect v-model="selectedStatus" :options="statuses" optionLabel="status" filter placeholder="Check by status"
            :maxSelectedLabels="3" class="custom-multiselect" @click:dropdown="resetStatusSelection" />
            <Button label="Reset" class="p-button-text" @click="resetStatusSelection"><i class="pi pi-times" @click="statusFilter = null"></i></Button>
            </div>
     
         <div class="filter-options">
          <Dropdown v-model="selectedTimeFrame" :options="timeframe" optionLabel="timeframe" placeholder="Check by timeframe"
            :maxSelectedLabels="1" class="custom-multiselect" />
            <Button label="Reset" class="p-button-text" @click="resetTimeSelection"><i class="pi pi-times" @click="statusFilter = null"></i></Button>
         </div>
         </div>

            
        </div>

        <div class="table">
          <BookingListTable/>
         </div>
        
      </div>
      
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, shallowRef } from "vue";
import FormContainer from '../components/dialogs/FormContainer.vue';
import BookingListTable from '@/components/table/BookingListTable.vue';

const selectedStatus = ref(null);
const selectedTimeFrame = ref(null);
const isVisible = ref(false);
const currentComponent = shallowRef(null)

const statuses = ref([
    { status: 'Cancelled'},
    { status: 'Confirmed'},
    { status: 'Completed' },
]);

const timeframe = ref([
    { timeframe: 'All'},
    { timeframe: 'Last Month'},
    { timeframe: 'Last Year' },
]);

function resetTimeSelection() {
  selectedTimeFrame.value = null
}

function resetStatusSelection() {
  selectedStatus.value = null
}

const router = useRouter()
const openDialog = (component) => {
  currentComponent.value = component
  isVisible.value = true
}

// const handleSubmitted = (data) => {
//   console.log('Form data received:', data)
//   isVisible.value = false
// }
function goToForm() {
  router.push('/form') // navigate to the form page
}
</script>
<style>

.navbar {
  display: flex;         
  align-items: center;   
  justify-content: flex-start;
  width: 100%;        
  height: 40px;           
  background-color: #ffffff; 
  padding: 0 1rem;        
  box-sizing: border-box; 
  border-bottom: 1px solid #eeeeee;
}

.logo {
  height: 24px;          
  width: auto;           
}

h1{
  font-size: 20px;
  font-weight: 750;
  padding-bottom: 6px;
  margin: 4px;
  align-self: center;
}

.table-view-container{
  margin-top: 40px;
  margin-left: 16px;
}

.table-title{
    font-weight: 750;
    font-size: 24px;
}

.table-actions{
  margin-top: 20px;
  background-color: rgb(235, 235, 235);
  width: 100%;
  height: 60px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-btn{
  background-color: #0088BC !important;
  margin: 10px;
  padding: 8px 10px;
}

.search-input{
  width: 300px;
  height: 34px;
}

.custom-multiselect {
  width: 200px; /* adjust as needed */
}

.p-multiselect-header{
  display: none;
}

.p-checkbox {
  margin-right: 10px;
}

.p-button-text{
  margin-left: 5px;
 margin-right: 5px;
 background: none;
}

.filter-options{
  display: flex;
  justify-content: space-between;
}

.create-search-options{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table {
  margin-top: 30px;
}


</style>