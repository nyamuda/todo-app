<template>
  <div class="mt-5">
    <div v-if="isAuthenticated">
      <AddMemberBooking />
    </div>
    <div v-else>
      <AddGuestBooking />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import AddMemberBooking from "@/components/Bookings/AddMemberBooking.vue";
import AddGuestBooking from "@/components/Bookings/AddGuestBooking.vue";
import { useRouter } from "vue-router";
const store = useStore();
const router = useRouter();
let isAuthenticated = computed(() => store.state.account.isAuthenticated);

//service id
let serviceId = ref(null);

onMounted(() => {
  //get all available car wash services
  store.dispatch("services/getServices");

  //get the service ID from the query parameter
  serviceId.value = router.currentRoute.value.query.serviceId;
});
</script>
