<template>
  <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" header="Cancel Booking" modal closable
    class="cancel-dialog">
    <div class="cancel-content">
      <p class="cancel-text">
        Are you sure you want to cancel booking
        <strong>#{{ booking.bookingId }}</strong>?
      </p>

      <div class="form-field">
        <label>Cancellation Date</label>
        <Calendar v-model="cancelledDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
      </div>

      <div class="form-field">
        <label>Amount Paid</label>
        <InputText v-model="amount" type="number" class="w-full" readonly />
      </div>

      <div class="form-field">
        <label>Refund Value</label>
        <InputText v-model="refundValue" type="number" class="w-full" placeholder="Enter refund amount" />
      </div>

      <div class="dialog-buttons">
        <Button label="Close" class="btn-close" @click="$emit('update:visible', false)" />
        <Button label="Confirm Cancel" class="btn-cancel" @click="confirmCancel" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import axios from "axios";

const props = defineProps({
  booking: Object,
  visible: Boolean,
});

const emit = defineEmits(["update:visible", "cancelled"]);

const cancelledDate = ref(new Date());
const refundValue = ref(0);
const bookingId = ref("");
const amount = ref(0);

watch(
  () => props.booking,
  (b) => {
    if (b) {
      bookingId.value = b.bookingId || "";
      amount.value = parseFloat(b.amount) || 0;
      refundValue.value = parseFloat(b.refundValue) || 0;
      cancelledDate.value = b.cancelled_date
        ? new Date(b.cancelled_date)
        : new Date();
    }
  },
  { immediate: true }
);

const formatDateLocal = (date) => {
  if (!date) return null;
  return date instanceof Date ? date.toISOString().split("T")[0] : date;
};

const confirmCancel = async () => {
  if (!bookingId.value) {
    console.error("No booking selected to cancel");
    return;
  }

    if (refundValue.value > amount.value) {
    alert("Refund amount cannot be higher than the original booking value.");
    return;
  }

  try {
    const payload = {
      cancelled_date: formatDateLocal(cancelledDate.value),
      refund_value: refundValue.value,
      status: "cancelled",
    };

    const response = await axios.put(
      `http://localhost:5000/api/bookings/${bookingId.value}/cancel`,
      payload
    );

    console.log("✅ Booking cancelled:", response.data);
    emit("cancelled");
    emit("update:visible", false);
  } catch (err) {
    console.error("Error cancelling booking:", err);
    alert("Failed to cancel booking. Please try again.");
  }
};
</script>

<style scoped>
.cancel-dialog .p-dialog-header {
  background: #fff5f0;
  color: #d32f2f;
  font-weight: 600;
  border-bottom: none;
}

.cancel-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 30px;
}

.cancel-text {
  color: #ff8b00;
  font-size: 1rem;
  font-weight: 500;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-close {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ccc;
}

.btn-cancel {
  background: #d32f2f;
  color: #fff;
  border: none;
}
</style>
