<template>
  <Toast />
  <ConfirmDialog />
</template>

<script setup>
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { ref } from "vue";

const confirm = useConfirm();
const toast = useToast();
const toastRef = ref(null);

const confirmSave = (onAccept) => {
  confirm.require({
    message: "Are you sure you want to save this booking?",
    header: "Save Confirmation",
    icon: "pi pi-check-circle",
    rejectLabel: "No",
    acceptLabel: "Yes, Save",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-success",
    accept: () => {
      onAccept?.();
      toast.add({
        severity: "success",
        summary: "Saved",
        detail: "Booking saved successfully!",
        life: 3000,
      });
    },
    reject: () => {
      toast.add({
        severity: "warn",
        summary: "Cancelled",
        detail: "Save cancelled",
        life: 3000,
      });
    },
  });
};

const confirmCancel = (onAccept) => {
  confirm.require({
    message: "Are you sure you want to cancel this booking?",
    header: "Cancel Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectLabel: "No",
    acceptLabel: "Yes, Cancel",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",
    accept: () => {
      onAccept?.();
      toast.add({
        severity: "info",
        summary: "Cancelled",
        detail: "Booking cancelled",
        life: 3000,
      });
    },
  });
};

const showWarning = (message) => {
  toastRef.value?.add({ severity: 'warn', summary: 'Warning', detail: message, life: 3000 });
};

// 👇 Expose functions so parent (booking form) can call them
defineExpose({
  confirmSave,
  confirmCancel,
  showWarning,
});
</script>
