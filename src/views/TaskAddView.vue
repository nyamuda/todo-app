<template>
  <div class="tasks">
    <TaskAdd />
  </div>
</template>

<script>
import TaskAdd from "@/components/Tasks/TaskAdd.vue";

export default {
  name: "TaskAddView",
  components: {
    TaskAdd,
  },
};
</script>
