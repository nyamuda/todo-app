<template>
  <div class="tasks mt-5">
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
