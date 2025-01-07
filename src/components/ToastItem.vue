<template>
  <div
    class="position-fixed bottom-0 start-50 translate-middle-x p-3"
    style="z-index: 11"
  >
    <div
      id="liveToast"
      class="toast align-items-center text-white bg-dark border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">{{ message }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { Toast } from "bootstrap";

const store = useStore();

let message = computed(() => store.state.toastMessage);

let showToast = () => {
  var toastLiveExample = document.getElementById("liveToast");
  if (toastLiveExample) {
    const toast = new Toast(toastLiveExample);
    toast.show(); // Show the toast
  }
};
defineExpose({
  showToast,
});
</script>
