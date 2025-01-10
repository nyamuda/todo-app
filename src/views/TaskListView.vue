<template>
  <div class="tasks mt-5">
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
