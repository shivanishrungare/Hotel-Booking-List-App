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



const showWarning = (message) => {
  toastRef.value?.add({ severity: 'warn', summary: 'Warning', detail: message, life: 3000 });
};

defineExpose({
  showWarning
});
</script>
