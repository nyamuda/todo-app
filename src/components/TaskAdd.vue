<template>
  <div class="add-item-container container m-auto mt-5">
    <h2 class="add-item-title text-start">Add New Task</h2>
    <form @submit.prevent="submitForm" class="add-item-form needs-validation">
      <div class="form-group">
        <label for="title" class="form-label">Title</label>
        <input
          type="text"
          id="title"
          v-model="form.title"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          class="form-input"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="dueDate" class="form-label">Due Date</label>
        <VueDatePicker
          id="dueDate"
          required
          v-model="form.dueDate"
          :transitions="true"
          time-picker-inline
          :is-24="true"
        />
      </div>

      <button
        v-if="isCreatingItem"
        type="submit"
        class="submit-button"
        disabled
      >
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Please wait...
      </button>
      <button v-else type="submit" class="submit-button">Add Task</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const store = useStore();

// Form data
const form = ref({
  title: "",
  description: "",
  dueDate: "",
});

// Submit form
const submitForm = () => {
  store.dispatch("addTask", form.value);
};

//show loading button or not
let isCreatingItem = computed(() => store.state.isCreatingItem);
</script>

<style scoped>
.add-item-container {
  padding: 2rem;
  background: #ffffff;
  animation: fadeIn 0.5s ease-in-out;
}

.add-item-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 728px) {
  .add-item-container {
    width: 40rem;
  }
}
</style>
