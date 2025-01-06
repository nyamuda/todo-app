<template>
  <div class="tasks">
    <TaskList></TaskList>
  </div>
</template>

<script>
import TaskList from "@/components/TaskList.vue";

export default {
  name: "HomeView",
  components: {
    TaskList,
  },
};
</script>
