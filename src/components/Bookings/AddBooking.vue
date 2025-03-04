<template>
  <div class="mt-5">
    <div v-if="isAuthenticated">
      <AddMemberBooking :service-type-id="serviceTypeId" />
    </div>
    <div v-else>
      <AddGuestBooking :service-type-id="serviceTypeId" />
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

//service type ID from the query parameter
let serviceTypeId = ref(null);

onMounted(() => {
  //get all available car wash services
  store.dispatch("services/getServices");

  //get the service ID from the query parameter
  serviceTypeId.value = router.currentRoute.value.query.serviceTypeId;
});
</script>
