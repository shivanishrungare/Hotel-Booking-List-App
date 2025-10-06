<template>
  
  <v-sheet class="mx-auto" width="300" height="200">
    <v-form @submit.prevent="saveBooking">
      <v-select v-model="form.hotelid">
      <option v-for="hotel in hotels" :key="hotel.id" :value="hotel.id">
        {{ hotel.name }}
      </option>
      </v-select>
      <v-text-field v-model="bookingDate" label="Booking Date"></v-text-field>
      <v-text-field v-model="value" label="Booking Amount"></v-text-field>
      <v-text-field v-model="lastName" label="Arrival Date"></v-text-field>
      <v-text-field v-model="lastName" label="Departure Date"></v-text-field>
      <v-text-field v-model="lastName" label="Cancelled Date"></v-text-field>
      <v-text-field v-model="lastName" label="Refund Amount"></v-text-field>
      <v-text-field v-model="lastName" label="Last name"></v-text-field>
    </v-form>
    
  </v-sheet>
</template>
<script>
</script>
