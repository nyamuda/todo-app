<template>
  <div class="m-auto">
    <TitleSection title="Profile & Bookings" />
    <div class="row mb-4 text-start">
      <h3>
        Hello, <span class="fw-bold text-primary">{{ userInfo.name }}</span>
      </h3>
      <p class="col-md-8">
        View your booking history or update your personal details right here.
      </p>
    </div>
    <div class="mt-3">
      <div class="card">
        <Tabs value="0">
          <TabList>
            <Tab value="0">My Details</Tab>
            <Tab value="1">Bookings Overview</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <div class="row mt-3">
                <div class="col-md-4">
                  <p>
                    Change your personal information and be sure to save your
                    updates.
                  </p>
                </div>
                <div class="col-md-8 mt-3 mt-md-0">
                  <UpdateAccountDetails />
                </div>
              </div>
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
import UpdateAccountDetails from "./UpdateAccountDetails.vue";

const store = useStore();

let userInfo = computed(() => store.state.account.loggedInUser);

onMounted(() => {});
</script>
