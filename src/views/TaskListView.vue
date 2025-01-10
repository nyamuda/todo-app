<template>
  <div class="tasks">
    <TaskList></TaskList>
  </div>
</template>

<script>
import TaskList from "@/components/Tasks/TaskList.vue";

export default {
  name: "TaskListView",
  components: {
    TaskList,
  },
};
</script>
