<template>
  <ConfirmToast ref="confirmRef" />
  <div class="form-wrapper">
    <form class="create-booking-form" @submit.prevent="saveBooking">
      <p style="color: #FF8B00 ">Create bookings that were not automatically tracked by Trivago or were deleted by mistake (e.g., phone or in-person reservations).</p>

      <!-- Row 1 -->
      <div class="form-row">
        <div class="form-field">
          <label>Hotel</label>
          <Dropdown
            v-model="selectedHotel"
            :options="hotels"
            optionLabel="hotel_name"
            optionValue="hotel_id"
            placeholder="Select a hotel"
            class="full-width"
          />
        </div>

        <div class="form-field">
          <label>Booking ID</label>
          <InputText v-model="bookingId" type="number" class="full-width" readonly />
        </div>
      </div>

     
      <!-- Row 3 -->
      <div class="form-row">
        <div class="form-field">
          <label>Arrival Date</label>
          <Calendar
            v-model="arrivalDate"
            class="full-width"
            dateFormat="yy-mm-dd"
            showIcon
          />
        </div>

        <div class="form-field">
          <label>Departure Date</label>
          <Calendar
            v-model="departureDate"
            class="full-width"
            dateFormat="yy-mm-dd"
            showIcon
          />
          <small v-if="departureError" class="error-msg">{{ departureError }}</small>
        </div>
      </div>


       <!-- Row 2 -->
      <div class="form-row">
        <div class="form-field">
          <label>Booking Date</label>
          <Calendar
            v-model="bookingDate"
            class="full-width"
            dateFormat="yy-mm-dd"
            showIcon
            readonlyInput
          />
        </div>

        

        <div class="form-field">
          <label>Amount Paid</label>
          <InputText v-model="amount" type="number" class="full-width" />
        </div>
      </div>

      <!-- Row 4 -->
      <div class="form-row">
        <div class="form-field">
          <label>Status</label>
          <Dropdown
            v-model="selectedStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select status"
            class="full-width"
          />
        </div>
      </div>

      <div class="form-field">
        <label>Source</label>
        <Dropdown
          v-model="selectedSource"
          :options="sources"
            optionLabel="label"
            optionValue="value"
          placeholder="Select source"
          class="full-width"
        /> 
          <small v-if="validationError" class="error-msg">{{ validationError }}</small>
      </div>

      <!-- Buttons -->
      <div class="form-buttons">
        <Button class="form-cancel-btn" label="Cancel" @click="cancel" ></Button>
        <Button class="form-save-btn"  label="Save" type="submit" ></Button>      
      </div>
    </form>

    <Dialog 
      v-model:visible="successDialog" 
      header="Success" 
      modal 
      closable 
      class="success-dialog"
    >
      <div class="success-content">
        <i class="pi pi-check-circle success-icon"></i>
        <p>Booking created successfully!</p>
      </div>
      <div class="dialog-footer">
        <Button label="OK" class="p-button-success" @click="successDialog = false" />
      </div>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import ConfirmToast from "./ConfirmToast.vue";
import Dialog from "primevue/dialog";

// --- State Variables ---
const hotels = ref([]);
const selectedHotel = ref(null);
const selectedSource = ref(null);
const bookingId = ref("");
const bookingDate = ref(new Date());
const amount = ref(null);
const arrivalDate = ref(null);
const departureDate = ref(null);
const selectedStatus = ref(null);
const departureError = ref("");
const confirmRef = ref(null);
const validationError = ref("");
const successDialog = ref(false);

function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// --- Dropdown options ---
const statusOptions = ref([
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
]);


const sources = ref([
  { label: 'Hotel-website', value: 'Hotel-Website' },
  { label: 'On-call', value: 'On-call' },
  { label: 'Reception', value: 'Reception' },
  { label: 'Booking.com', value: 'Booking.com' },
  { label: 'Expedia', value: 'Expedia' },
  { label: 'Hotels.com', value: 'Hotels.com' },
  { label: 'Vrbo', value: 'Vrbo' },
  { label: 'Trip.com', value: 'Trip.com' },
  { label: 'Priceline', value: 'Priceline' },
  { label: 'Agoda', value: 'Agoda' },
  { label: 'Accor', value: 'Accor' },
  { label: 'Other booking sites', value: 'Other booking sites' },
]);

// --- Fetch Hotels ---
const fetchHotels = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/hotels");
    hotels.value = res.data;
  } catch (err) {
    console.error("Error fetching hotels:", err);
  }
};


const validateForm = () => {
  if (
    !selectedHotel.value ||
    !selectedSource.value ||
    !amount.value ||
    !arrivalDate.value ||
    !departureDate.value ||
    !selectedStatus.value
  ) {
    validationError.value = "All fields are mandatory!";
    return false;
  }

 

  validationError.value = ""; // clear error if all is good
  return true;
};

// --- Fetch latest booking ID ---
const fetchNextBookingId = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/bookings");
    if (res.data.length > 0) {
      const latestId = Math.max(...res.data.map((b) => b.booking_id || 0));
      bookingId.value = latestId + 1;
    } else {
      bookingId.value = 1;
    }
  } catch (err) {
    console.error("Error fetching bookings:", err);
  }
};



// --- Lifecycle ---
onMounted(async () => {
  await Promise.all([fetchHotels(), fetchNextBookingId()]);
});

// --- Validation ---
watch([arrivalDate, departureDate], ([a, d]) => {
  departureError.value = "";
  if (a && d && d <= a) {
    departureError.value = "Departure must be after arrival.";
  }
});

import { defineEmits } from "vue";

const emit = defineEmits(['cancel']);

const cancel= () => {
  emit('cancel'); 
};

const saveBooking = async () => {
 if (!validateForm()) {
    confirmRef.value.showWarning(validationError.value); // show warning if fields missing
    return;
  }

  const newBooking = {
    booking_id: bookingId.value,
    hotel_id: selectedHotel.value,
    booking_date: formatDateLocal(bookingDate.value),
    source: selectedSource.value,
    value: amount.value,
    arrival_date: arrivalDate.value ? formatDateLocal(arrivalDate.value) : null,
    departure_date: departureDate.value ? formatDateLocal(departureDate.value) : null,
    cancelled_date: null,
    refund_value: 0,
    status: selectedStatus.value,
  };

  try {
    await axios.post("http://localhost:5000/api/bookings/create", newBooking);
    successDialog.value = true;
    await fetchNextBookingId(); 
  } catch (err) {
    console.error("Error creating booking:", err);
  }
};
</script>

<style scoped>
.form-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.create-booking-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 700px;
  max-width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 0rem 2rem 1rem 2rem;
  overflow: hidden;
  position: fixed;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-field {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-field label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.full-width {
  width: 100%;
}

.error-msg {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.form-save-btn{
  background-color: #0088BC;
  color: #fff;
}

.form-cancel-btn{
  background-color: #ffffff;
  color: #0088BC;
  border: 1px solid #0088BC;
}

.success-dialog {
  border-radius: 16px !important;
  overflow: hidden;
  animation: fadeIn 0.3s ease-in-out;
  max-width: 350px;
}

.p-dialog-header {
  background-color: #E6F7EE;
  color: #256029;
  font-weight: 600;
  font-size: 1.2rem;
  border-bottom: none;
}

.p-dialog-content {
  text-align: center;
  padding: 1.5rem 1rem;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 60px;
}

.success-icon {
  font-size: 2.5rem;
  color: #22C55E;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  padding: 1rem;
  border-top: 1px solid #E5E7EB;
}

.p-button-success {
  background-color: #22C55E;
  border: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

</style>
