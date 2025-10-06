<template>
  <div class="table-container">
    <div class="table-view">
      <DataTable
        v-model:filters="filters"
        :value="filteredBookings"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        dataKey="bookingId"
        filterDisplay="row"
        stripedRows
        scrollable
        scroll-height="600px"
        :globalFilterFields="[
          'hotel',
          'bookingId',
          'status',
          'bookingDate',
          'arrivalDate',
          'departureDate',
          'cancelledDate',
          'amount',
          'refundValue'
        ]"
      >
        <!-- ✅ Header -->
        <template #header>
          <div class="flex justify-content-between align-items-center w-full gap-3">
            <!-- Create Button + Dialog -->
            <div class="create-search-options">
              <Button class="custom-btn" @click=openDialog(FormContainer)>
                <i class="pi pi-plus-circle mr-2"></i>Create
              </Button>
              <Dialog
                v-model:visible="isVisible"
                modal
                :closable="true"
                class="custom-dialog"
                header="Hotel Booking Form"
              >
                <FormContainer @cancel="isVisible = false" />
              </Dialog>
            </div>

            <!-- Timeframe Dropdown -->
            <Dropdown
              v-model="selectedTimeFrame"
              :options="timeframe"
              optionLabel="timeframe"
                optionValue="timeframe"
              placeholder="Check by timeframe"
              class="custom-multiselect"
            />

            <!-- Global Search -->
            <div class="flex justify-content-end">
              <IconField iconPosition="left">
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search for Hotel or Booking No."
                />
              </IconField>
            </div>
          </div>
        </template>

        <!-- Empty Table -->
        <template #empty>No bookings found.</template>

        <!-- ✅ Table Columns -->
        <Column field="hotel" header="Hotel" sortable />

        <Column field="bookingId" header="Booking ID" sortable />

        <Column field="bookingDate" header="Booking Date" sortable />

        <Column field="amount" header="Amount" sortable />

        <Column field="arrivalDate" header="Arrival" sortable />

        <Column field="departureDate" header="Departure" sortable />

        <Column field="cancelledDate" header="Cancelled" sortable />

        <Column field="refundValue" header="Refund" sortable />

        <!-- ✅ Status column with dropdown filter -->
        <Column field="status" header="Status" sortable :showFilterMenu="false">
          <template #filter="{ filterModel, filterCallback }">
            <Dropdown
              v-model="filterModel.value"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select status"
              @change="filterCallback()"
              class="p-column-filter"
              showClear
            />
          </template>
        </Column>

        <!-- ✅ Actions column -->
        <Column header="Actions">
          <template #body="{ data }">
            <Button
              icon="pi pi-ellipsis-v"
              @click="toggleMenu($event, data)"
              aria-haspopup="true"
              aria-controls="overlay_menu"
            />
          </template>
        </Column>
      </DataTable>

      <!-- ✅ Popup menu -->
      <Menu ref="menu" id="overlay_menu" :model="menuItems" popup />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import FormContainer from '../dialogs/FormContainer.vue'
import { shallowRef } from 'vue'

// === State ===
const bookings = ref([])
const isVisible = ref(false)
const selectedTimeFrame = ref('All')


const timeframe = [
  { timeframe: 'All' },
  { timeframe: 'Last Month' },
  { timeframe: 'Last Year' }
]

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  status: { value: null, matchMode: 'equals' }
})

const statusOptions = [
  { label: 'All', value: null },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Completed', value: 'completed' }
]

const currentComponent = shallowRef(null);
const openDialog = (component) => {
  currentComponent.value = component
  isVisible.value = true
}



// === Fetch data ===
onMounted(async () => {
  const res = await axios.get('http://localhost:5000/api/bookings')
  bookings.value = res.data.map(b => ({
    bookingId: b.booking_id,
    hotel: b.hotel_name,
    bookingDate: formatDate(b.booking_date),
    amount: b.value,
    arrivalDate: formatDate(b.arrival_date),
    departureDate: formatDate(b.departure_date),
    cancelledDate: formatDate(b.cancelled_date),
    refundValue: b.refund_value,
    status: b.status?.toLowerCase()
  }))
})

const parseDate = dateString => {
  if (!dateString) return null
  const [day, month, year] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const filteredBookings = computed(() => {
  console.log('🕵️‍♂️ selectedTimeFrame:', selectedTimeFrame.value)
  console.log('📅 Now:', new Date().toISOString())

  if (selectedTimeFrame.value === 'All') {
    console.log('➡️ Showing all bookings:', bookings.value.length)
    return bookings.value
  }

  const now = new Date()

  if (selectedTimeFrame.value === 'Last Year') {
    console.log('📆 Filtering: Last Year (2024)')
    const filtered = bookings.value.filter(b => {
      const arrival = parseDate(b.arrivalDate)
      const departure = parseDate(b.departureDate)

      const arrivalYear = arrival ? arrival.getFullYear() : null
      const departureYear = departure ? departure.getFullYear() : null

      const match = arrivalYear === 2024 || departureYear === 2024

      console.log(`Booking ${b.bookingId}:`, {
        arrivalDate: b.arrivalDate,
        departureDate: b.departureDate,
        arrivalYear,
        departureYear,
        match
      })

      return match
    })
    console.log('✅ Matched bookings (Last Year):', filtered.length)
    return filtered
  }

  if (selectedTimeFrame.value === 'Last Month') {
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
    const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()

    console.log('📆 Filtering: Last Month', {
      now: now.toISOString(),
      lastMonth,
      lastMonthYear
    })

    const filtered = bookings.value.filter(b => {
      const arrival = parseDate(b.arrivalDate)
      const departure = parseDate(b.departureDate)

      const matchArrival =
        arrival &&
        arrival.getMonth() === lastMonth &&
        arrival.getFullYear() === lastMonthYear

      const matchDeparture =
        departure &&
        departure.getMonth() === lastMonth &&
        departure.getFullYear() === lastMonthYear

      const match = matchArrival || matchDeparture

      console.log(`Booking ${b.bookingId}:`, {
        arrivalDate: b.arrivalDate,
        departureDate: b.departureDate,
        arrivalMonth: arrival ? arrival.getMonth() : null,
        arrivalYear: arrival ? arrival.getFullYear() : null,
        departureMonth: departure ? departure.getMonth() : null,
        departureYear: departure ? departure.getFullYear() : null,
        match
      })

      return match
    })
    console.log('✅ Matched bookings (Last Month):', filtered.length)
    return filtered
  }

  console.warn('⚠️ Unknown selectedTimeFrame:', selectedTimeFrame.value)
  return bookings.value
})




const formatDate = dateString => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return `${String(d.getUTCDate()).padStart(2, '0')}-${String(
    d.getUTCMonth() + 1
  ).padStart(2, '0')}-${d.getUTCFullYear()}`
}

// === Menu Actions ===
const menu = ref()
const selectedBooking = ref(null)
const menuItems = [
  {
    items: [
      { label: 'Edit', icon: 'pi pi-pencil' },
      { label: 'Cancel', icon: 'pi pi-times-circle' },
      { label: 'Delete', icon: 'pi pi-trash' }
    ]
  }
]

const toggleMenu = (event, booking) => {
  selectedBooking.value = booking
  menu.value.toggle(event)
}
</script>

<style>
.table-container {
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #E5E7EB;
  margin-top: 10px;
  overflow: hidden;
}

.table-view {
  padding: 5px;
}

/* Sticky header */
.p-datatable .p-datatable-thead > tr > th {
  background-color: #0088BC;
  color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 5;
}

.p-inputtext {
  padding: 5px;
}

.p-datatable-scrollable-body {
  max-height: 400px;
}

.p-button {
  background-color: white;
  border: none;
  color: black;
}

.p-menu {
  z-index: 9999 !important;
  min-width: 8rem;
}
</style>
