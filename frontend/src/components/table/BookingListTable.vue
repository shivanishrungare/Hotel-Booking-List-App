<template>
  <div class="table-container">
    <div class="table-view">
      <div class="summary-cards">
        <Card class="summary-card total-bookings">
          <template #title>Total Bookings</template>
          <template #content>
            <div class="summary-value">{{ totalBookings }}</div>
          </template>
        </Card>

        <Card class="summary-card total-revenue">
          <template #title>Total Revenue</template>
          <template #content>
            <div class="summary-value">
              {{ totalRevenue }}
            </div>
          </template>
        </Card>

        <Card class="summary-card confirmed">
          <template #title>Confirmed</template>
          <template #content>
            <div class="summary-value">{{ totalConfirmed }}</div>
          </template>
        </Card>

        <Card class="summary-card cancelled">
          <template #title>Cancelled</template>
          <template #content>
            <div class="summary-value">{{ totalCancelled }}</div>
          </template>
        </Card>

        <Card class="summary-card completed">
          <template #title>Completed</template>
          <template #content>
            <div class="summary-value">{{ totalCompleted }}</div>
          </template>
        </Card>
      </div>
      <DataTable v-model:filters="filters" :value="filteredBookings" paginator :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="bookingId" filterDisplay="row" stripedRows scrollable
        scroll-height="600px" :globalFilterFields="[
          'hotel',
          'bookingId',
          'status',
          'source',
          'bookingDate',
          'arrivalDate',
          'departureDate',
          'cancelledDate',
          'amount',
          'refundValue'
        ]">

        <template #header>
          <div class="actions-table-data">

            <div class="create-search-options">
              <Button class="custom-btn" @click=openDialog(FormContainer)>
                <i class="pi pi-plus-circle mr-2"></i>Create
              </Button>

              <div class="flex justify-content-between">
                <IconField iconPosition="left">
                  <InputText v-model="filters['global'].value" placeholder="Search for any keyword" width="50px">
                  </InputText>
                  <InputIcon>
                  </InputIcon>
                </IconField>
              </div>
            </div>
            <div class="filter-by-timeframe">
              <Dropdown v-model="selectedTimeFrame" :options="timeframe" optionLabel="timeframe" optionValue="timeframe"
                placeholder="Check by timeframe" class="custom-multiselect" />

            </div>


            <Dialog v-model:visible="isVisible" modal :closable="true" class="custom-dialog"
              header="Hotel Booking Form">
              <FormContainer @cancel="isVisible = false" @submitted="handleFormSubmitted" />
            </Dialog>


            <Dialog v-model:visible="editDialogVisible" modal :closable="true" class="custom-dialog" header="Edit Hotel Booking Form">
              <EditFormContainer v-if="selectedBooking" :booking="selectedBooking" @cancel="editDialogVisible = false"
                @submitted="fetchBookings" />
            </Dialog>

            <CancelDialog v-model:visible="cancelDialogVisible" :booking="selectedBooking" @cancelled="fetchBookings" />

            <DeleteDialog v-model:visible="deleteDialogVisible" :booking="selectedBooking" @deleted="fetchBookings" />

          </div>
        </template>


        <template #empty>No bookings found.</template>


        <Column field="bookingId" header="Booking ID" sortable />

        <Column field="hotel" header="Hotel" sortable></Column>



        <Column field="bookingDate" header="Booking Date" sortable />

        <Column field="source" header="Source" sortable></Column>


        <Column field="amount" header="Amount" sortable />

        <Column field="arrivalDate" header="Arrival" sortable />

        <Column field="departureDate" header="Departure" sortable />

        <Column field="cancelledDate" header="Cancelled" sortable />

        <Column field="refundValue" header="Refund" sortable />


        <Column field="status" header="Status" sortable :showFilterMenu="false">
          <template #filter="{ filterModel, filterCallback }">
            <Dropdown v-model="filterModel.value" :options="statusOptions" optionLabel="label" optionValue="value"
              placeholder="Select status" @change="filterCallback()" class="p-column-filter" showClear />
          </template>
        </Column>


        <Column header="Actions">
          <template #body="{ data }">
            <Button icon="pi pi-ellipsis-v" @click="toggleMenu($event, data)" aria-haspopup="true"
              aria-controls="overlay_menu" />
          </template>
        </Column>
      </DataTable>


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
import FormContainer from '../forms/FormContainer.vue'
import { shallowRef } from 'vue'
import EditFormContainer from '../forms/EditFormContainer.vue'
import CancelDialog from '../dialogs/CancelDialog.vue'
import DeleteDialog from '../dialogs/DeleteDialog.vue'
import { formatDate } from '@/stores/helper.js'
import { convertToISO } from '@/stores/helper.js'

const props = defineProps({
  booking: { type: Object, required: true },
  visible: Boolean,
});
const emit = defineEmits(["update:visible", "cancelled"]);


const bookings = ref([])
const isVisible = ref(false)
const editDialogVisible = ref(false)
const selectedTimeFrame = ref(null)

const timeframe = [
  { timeframe: 'Last Month', value: 'Last Month' },
  { timeframe: 'Last Year', value: 'Last Year' },
  { timeframe: 'All', value: null }
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

const handleFormSubmitted = async () => {
  isVisible.value = false
  isEditVisible.value = false
  await fetchBookings()
}

const currentComponent = shallowRef(null);
const openDialog = (component) => {
  currentComponent.value = component
  isVisible.value = true
}


const openEditDialog = () => {
  if (!selectedBooking.value) return;

  const b = selectedBooking.value;
  selectedBooking.value = {
    booking_id: b.bookingId,
    hotel_id: b.hotel_id,
    source: b.source,
    value: b.amount,
    bookingDate: convertToISO(b.bookingDate),
    arrivalDate: convertToISO(b.arrivalDate),
    departureDate: convertToISO(b.departureDate),
    status: b.status,
  };

  editDialogVisible.value = true;
};


const parseDate = dateString => {
  if (!dateString) return null
  const [day, month, year] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}


onMounted(async () => {
  const res = await axios.get('http://localhost:5000/api/bookings')
  bookings.value = res.data.map(b => ({
    bookingId: b.booking_id,
    hotel: b.hotel_name,
    hotel_id: b.hotel_id,
    bookingDate: formatDate(b.booking_date),
    source: b.source,
    amount: b.value,
    arrivalDate: formatDate(b.arrival_date),
    departureDate: formatDate(b.departure_date),
    cancelledDate: formatDate(b.cancelled_date),
    refundValue: b.refund_value,
    status: b.status?.toLowerCase()
  }))
})


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

const totalBookings = computed(() => filteredBookings.value.length)

const totalRevenue = computed(() => {
  const total = filteredBookings.value
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0)

  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(total)
})

const totalConfirmed = computed(
  () => filteredBookings.value.filter(b => b.status === 'confirmed').length
)
const totalCancelled = computed(
  () => filteredBookings.value.filter(b => b.status === 'cancelled').length
)
const totalCompleted = computed(
  () => filteredBookings.value.filter(b => b.status === 'completed').length
)

const menu = ref()
const selectedBooking = ref(null)
const cancelDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const menuItems = [
  {
    items: [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => openEditDialog(EditFormContainer),
      },
      {
        label: 'Cancel',
        icon: 'pi pi-times-circle',
        command: () => (cancelDialogVisible.value = true),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => (deleteDialogVisible.value = true),
      },
    ]
  }
]


const toggleMenu = (event, booking) => {
  selectedBooking.value = booking
  menu.value.toggle(event)
}
</script>

<style>
.create-search-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions-table-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}

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


.p-datatable .p-datatable-thead>tr>th {
  text-align: center;
  font-weight: 400;
  border: none;
  background-color: #0088BC;
  color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 5;
}

.p-inputtext {
  padding: 7px;
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

.p-column-filter-clear-button {
  color: #ffffff;
}

.p-dropdown .p-dropdown-clear-icon {
  visibility: hidden;
}

.p-dialog {
  box-shadow: none;
}

.p-card-body {
  padding: 5px;
}

.p-card-content {
  padding: 5px 10px;
}

.p-card-title {
  font-size: 20px;
  font-weight: 600;
}

.p-datatable-header {
  background-color: #ffffff;
}

.p-datatable .p-sortable-column .p-sortable-column-icon {
  color: #ffffff;
}

.p-submenu-header{
  padding: 0px;
}

.p-menuitem-icon{
  margin-right: 10px;
  padding: 5px;
}

.summary-cards {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  flex-wrap: wrap;
}

.summary-card {
  flex: 1;
  min-width: 100px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
}

.summary-card .summary-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.total-bookings {
  border-top: 4px solid #0EA5E9;
}

.total-revenue {
  border-top: 4px solid #22C55E;
}

.confirmed {
  border-top: 4px solid #10B981;
}

.cancelled {
  border-top: 4px solid #EF4444;
}

.completed {
  border-top: 4px solid #3B82F6;
}
</style>
