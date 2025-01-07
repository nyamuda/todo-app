import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state() {
    return {
      todoTasks: [],
      apiUrl: "http://quovoyapi.runasp.net/api/items",
      isGettingItems: false,
      toastMessage: "",
      failureMessage: "Oops! Something went wrong. Please try again.",
    };
  },
  getters: {},
  mutations: {
    formatTaskDate(state, tasks) {
      // mutate state by formatting the date
      state.todoTasks = tasks.map((task) => {
        return {
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate).toLocaleString(), // Format the dueDate
        };
      });
    },
    addToastMessage(state, message) {
      state.toastMessage = message;
    },
  },
  actions: {
    //fetch tasks
    async fetchTasks({ commit }) {
      try {
        this.state.isGettingItems = true;
        console.log(`$Api url: ${this.state.apiUrl}`);
        const response = await axios.get(this.state.apiUrl);
        //mutate the state with the fetched tasks
        commit("formatTaskDate", response.data);
        this.state.isGettingItems = false;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        this.state.isGettingItems = false;
      }
    },

    //add a task
    async addTask({ commit }, task) {
      try {
        const response = await axios.post(
          "https://quovoyapi.runasp.net/tasks",
          task
        ); // Replace with your API endpoint
        commit("ADD_TASK", response.data); // Update the state with the new task
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },

    // Asynchronous action to delete a task
    async deleteTask({ dispatch }, id) {
      try {
        console.log(`Id of item ${id}`);
        // Send a DELETE request to the API
        let response = await axios.delete(`${this.state.apiUrl}/${id}`);

        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //refresh the list of items
          //get all items
          await dispatch("fetchTasks");
        } else {
          console.error("Failed to delete task:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
  },
  modules: {},
});
