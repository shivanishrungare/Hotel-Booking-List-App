<template>
  <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" header="Delete Booking" modal closable
    class="delete-dialog">
    <div class="delete-content">
      <p class="delete-text">
        Are you sure you want to delete booking
        <strong>#{{ booking.booking_id || booking.bookingId }}</strong>?
      </p>

      <div class="dialog-buttons">
        <Button label="Close" class="btn-close" @click="$emit('update:visible', false)" />
        <Button label="Confirm Delete" class="btn-delete" @click="confirmDelete" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import axios from "axios";

const props = defineProps({
  booking: Object,
  visible: Boolean,
});

const emit = defineEmits(["update:visible", "deleted"]);
const cancel = () => {
  emit('cancel');
};

const bookingId = ref("");

watch(
  () => props.booking,
  (b) => {
    if (b) {
      bookingId.value = b.booking_id || b.bookingId || "";
    }
  },
  { immediate: true }
);

const confirmDelete = async () => {
  if (!bookingId.value) {
    console.error("No booking selected to delete");
    alert("No booking selected. Please try again.");
    return;
  }

  try {
    const response = await axios.delete(
      `http://localhost:5000/api/bookings/${bookingId.value}`
    );
    console.log("✅ Booking deleted:", response.data);
    emit("deleted");
    cancel();
    window.location.reload();
  } catch (err) {
    console.error("Error deleting booking:", err);
    alert("Failed to delete booking. Please try again.");
  } finally {
    emit("update:visible", false);
  }
};
</script>


<style scoped>
.delete-dialog .p-dialog-header {
  background: #fff5f0;
  color: #d32f2f;
  font-weight: 600;
  border-bottom: none;
}

.delete-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 30px;
}

.delete-text {
  color: #ff8b00;
  font-size: 1rem;
  font-weight: 500;
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

.btn-delete {
  background: #d32f2f;
  color: #fff;
  border: none;
}
</style>
