<template>
  <div class="m-auto">
    <TitleSection title="Account Overview" />
    <div class="row mb-4 text-start">
      <p class="col-md-8">
        Hello, <span class="fw-bold">{{ userInfo.name }}</span
        >! View your booking history, manage appointments, and update your
        personal details right here.
      </p>
    </div>
    <div class="mt-5">
      <div class="card">
        <Tabs value="0">
          <TabList>
            <Tab value="0">My Details</Tab>
            <Tab value="1">Bookings Overview</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <p class="m-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </TabPanel>
            <TabPanel value="1">
              <BookingFacts />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import TitleSection from "../Common/Elements/TitleSection.vue";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import BookingFacts from "../Bookings/BookingFacts.vue";

const store = useStore();

let userInfo = computed(() => store.state.account.loggedInUser);

onMounted(() => {});
</script>
