<template>
  <div>
    <h1 class="display-6 mb-4">Car Wash Features</h1>
    <div class="d-flex justify-content-end">
      <router-link to="/features/add">
        <Button label="Add new feature" icon="fas fa-plus" size="small" />
      </router-link>
    </div>
    <div class="" v-if="features.length > 0 || isGettingFeatures">
      <!--Skeleton table start-->
      <DataTable :value="rowSkeletons" v-if="isGettingFeatures">
        <Column field="name" header="Name">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>

        <Column field="actions" header="Actions">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
      </DataTable>
      <!--Skeleton table end-->
      <!--Table Start-->
      <div v-else>
        <DataTable :value="features">
          <Column field="name" header="Name"></Column>

          <Column field="id" header="Actions">
            <template #body="slotProps">
              <div>
                <Button
                  icon="fas fa-pen"
                  severity="contrast"
                  variant="text"
                  size="small"
                  label="Update"
                  aria-label="update"
                  @click="updateFeature(slotProps.data.id)"
                />
                <Button
                  icon="fas fa-trash"
                  severity="danger"
                  variant="text"
                  size="small"
                  :label="
                    isDeletingFeature && slotProps.data.id == selectedFeatureId
                      ? 'Deleting...'
                      : 'Delete'
                  "
                  :loading="
                    isDeletingFeature && slotProps.data.id == selectedFeatureId
                  "
                  aria-label="delete"
                  @click="deleteFeature(slotProps.data.id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
        <!--Load more features start-->
        <div class="d-grid gap-2 col-md-3 mx-auto mt-4">
          <Button
            @click="loadMoreFeatures"
            type="button"
            :label="isLoadingMoreFeatures ? 'Loading...' : 'Load more'"
            icon="fas fa-chevron-down"
            :loading="isLoadingMoreFeatures"
            :disabled="
              isLoadingMoreFeatures || !hasMoreFeatures || isGettingFeatures
            "
            severity="contrast"
            size="small"
          />
        </div>
        <!--Load more features end-->
      </div>
      <!--Table End-->
    </div>
    <!--No Features Start-->
    <div
      v-else
      class="d-flex justify-content-center align-items-center flex-column text-center py-5 bg-light rounded-3 shadow-sm mt-5"
    >
      <div class="mb-2">
        <!-- Font Awesome Icon for no features -->
        <i class="fas fa-0 fa-3x text-primary"></i>
      </div>
      <p class="fs-4 text-muted mb-2">
        There are no available features at the moment.
      </p>
      <p class="text-muted">
        Add a feature and let clients book car wash sessions.
      </p>
    </div>
    <!--No Features End-->
    <!--Delete confirmation dialog start-->
    <ConfirmDialog></ConfirmDialog>
    <!--Delete confirmation dialog end-->
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { Skeleton } from "primevue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import { useToast } from "primevue/usetoast";
const confirm = useConfirm();

let store = useStore();
let route = useRouter();
const toast = useToast();

onMounted(() => {
  getFeatures();
});

let features = computed(() => store.state.features.features);
let rowSkeletons = new Array(4);
let isGettingFeatures = computed(() => store.state.features.isGettingFeatures);
let isDeletingFeature = computed(() => store.state.features.isDeletingFeature);
//ID of feature recording in action(e.g currently being deleted)
// this is used to show a loader to the row of the item currently being deleted
let selectedFeatureId = ref(null);

//are there more features currently being loaded
let isLoadingMoreFeatures = computed(
  () => store.state.features.isLoadingMoreFeatures
);

//are there still more features that can be loaded
let hasMoreFeatures = computed(() => store.state.features.pageInfo.hasMore);

//get features
let getFeatures = () => {
  //set the page and pageSize pagination query parameters
  let pageInfo = {
    page: 1,
    pageSize: 10,
    hasMore: false,
  };
  //mutate the state
  store.commit("features/updatePageInfo", pageInfo);
  store
    .dispatch("features/getFeatures")
    .then()
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 5000,
      });
    });
};
//load more features
let loadMoreFeatures = () => {
  store
    .dispatch("features/loadMoreFeatures")
    .then()
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Load Failed",
        detail: message,
        life: 5000,
      });
    });
};

let deleteFeature = (id) => {
  //show a loader to the row of the item currently being deleted
  selectedFeatureId.value = id;
  confirm.require({
    message: "Do you want to delete this feature?",
    header: "Delete Feature",
    icon: "fas fa-circle-info",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      size: "small",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      size: "small",
      severity: "danger",
    },
    accept: () => {
      store
        .dispatch("features/deleteFeature", id)
        .then((message) => {
          toast.add({
            severity: "success",
            summary: "Feature Deleted",
            detail: message,
            life: 5000,
          });
          getFeatures();
        })
        .catch((message) => {
          toast.add({
            severity: "error",
            summary: "Delete Failed",
            detail: message,
            life: 10000,
          });
        })
        .finally(() => {
          //hide the loader
          selectedFeatureId.value = null;
        });
    },
    reject: () => {},
  });
};

let updateFeature = (id) => {
  route.push(`features/${id}/update`);
};
</script>
