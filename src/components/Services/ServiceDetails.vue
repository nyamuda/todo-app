<template>
  <div></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useToast } from "primevue";
import { useRouter } from "vue-router";

let store = useStore();
let toast = useToast();
let router = useRouter();

let service = ref(null);
let isGettingService = ref(false);
let id = ref(null);

onMounted(() => {
  //get the id of the service we want to show the details of
  //from the route parameter
  id.value = router.currentRoute.value.params.id;
  getService(id.value);
});

//get a service with a given ID
let getService = (id) => {
  isGettingService.value = true;
  store
    .dispatch("services/getService", id)
    .then((data) => (service.value = data))
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Fetch Failed",
        detail: message,
        life: 10000,
      });
    })
    .finally(() => {
      isGettingService.value = false;
    });
};
</script>
