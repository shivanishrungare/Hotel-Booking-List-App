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

        <div class="table">
          <BookingListTable :bookings="filteredBookings" />
         </div>
        
      </div>
      
  </div>
</template>

<script setup>
import BookingListTable from '@/components/table/BookingListTable.vue';

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
  background-color: #E5E7EB;
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
  color: #ffffff;

}

.search-input{
  width: 300px;
  height: 34px;
}

.custom-multiselect {
  width: 200px;
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

.custom-dialog{
  width: 40rem;
  height: 60rem;
  padding: 0px;
}

.p-dialog-content{
  padding: 0px;
}

.p-dialog-header{
  display: flex;
  justify-content: space-between;
  padding: 30px 30px 0px 30px;
}

.p-dialog-title{
  font-weight: 600;
}

</style>