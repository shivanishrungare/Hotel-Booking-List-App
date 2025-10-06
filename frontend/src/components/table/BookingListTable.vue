<template>
  <div class="card">
    <DataTable :value="bookings" tableStyle="min-width: 70rem" @booking-added="addBooking" stripedRows>
      <Column field="hotel" sortable header="Hotel"></Column>
      <Column field="bookingId" sortable header="Booking ID"></Column>
      <Column field="bookingDate" sortable header="Booking Date"></Column>
      <Column field="amount" sortable header="Amount"></Column>
      <Column field="arrivalDate" sortable header="Arrival"></Column>
      <Column field="departureDate" sortable header="Departure"></Column>
      <Column field="cancelledDate" sortable header="Cancelled Date"></Column>
      <Column field="refundValue" sortable header="Refund Amount"></Column>
      <Column field="status" sortable header="Status"></Column>

      <!-- Actions column -->
      <Column header="Actions">
        <template #body="slotProps">
          <Button
            icon="pi pi-ellipsis-v"
            
            @click="toggleMenu($event, slotProps.data)"
            aria-haspopup="true"
            aria-controls="overlay_menu"
          ></Button>
        </template>
      </Column>
    </DataTable>

    <!-- Popup menu -->
    <Menu ref="menu" id="overlay_menu" :model="menuItems" popup ></Menu>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from "axios";

const bookings = ref([]);

onMounted(async () => {
  const response = await axios.get("http://localhost:5000/api/bookings");
bookings.value = response.data.map(b => ({
  bookingId: b.booking_id,
  hotel: b.hotel_name, 
  bookingDate: formatDate(b.booking_date),
  amount: b.value,
  arrivalDate: formatDate(b.arrival_date),
  departureDate: formatDate(b.departure_date),
  cancelledDate: formatDate(b.cancelled_date),
  refundValue: b.refund_value,
  status: b.status
  }));
});

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString); // parse ISO date
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}-${month}-${year}`;
};

const addBooking = (newBooking) => {
  bookings.value.push(newBooking);
};


const menu = ref()
const selectedBooking = ref(null)

const menuItems = ref([
  {
    
    items: [
      { label: 'Edit', icon: 'pi pi-pencil' },
      { label: 'Cancel', icon: 'pi pi-times-circle' },
      { label: 'Delete', icon: 'pi pi-trash' }
    ]
  }
])

const toggleMenu = (event, booking) => {
  selectedBooking.value = booking
  menu.value.toggle(event)
}


</script>

<style>
.card {
  margin-top: 80px;
  padding: 1rem;
}

.p-menu {
  z-index: 9999 !important;
  min-width: 8rem;
  padding: 10px;
}

.p-menuitem-icon{
    margin-right: 10px;

}

.p-menuitem-link {
    padding: 5px;
}

.p-submenu-header{
    padding: 0rem;
}

.p-button{
    background-color: white;
    border: none;
    border-radius: none;
    color: black;
    outline-color: white;
}
</style>
