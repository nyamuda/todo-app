<template>
  <div class="add-item-container shadow rounded container m-auto mt-5">
    <h2 class="add-item-title text-start">Add New Task</h2>
    <form @submit.prevent="submitForm" class="add-item-form">
      <div class="form-group">
        <label for="title" class="form-label">Title</label>
        <input
          type="text"
          id="title"
          v-model="form.title"
          class="form-input"
          placeholder="Enter task title"
          required
        />
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          class="form-input"
          placeholder="Enter task description"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="dueDate" class="form-label">Due Date</label>
        <input
          type="date"
          id="dueDate"
          v-model="form.dueDate"
          class="form-input"
          required
        />
      </div>

      <button type="submit" class="submit-button">Add Task</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

// Form data
const form = ref({
  title: "",
  description: "",
  dueDate: "",
  status: "pending",
});

// Submit form
const submitForm = async () => {
  try {
    await store.dispatch("addTask", form.value); // Dispatch the addTask action
    resetForm(); // Reset the form after submission
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Reset form
const resetForm = () => {
  form.value = {
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
  };
};
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 1rem;
  font-weight: 500;
  color: #555;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  border-color: #646cff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.2);
}

textarea.form-input {
  resize: vertical;
}

.submit-button {
  padding: 0.75rem;
  background: #646cff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.submit-button:hover {
  background: #535bf2;
  transform: translateY(-2px);
}

.submit-button:active {
  transform: translateY(0);
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 728px) {
  .add-item-container {
    width: 40rem;
  }
}
</style>
