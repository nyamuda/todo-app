import { createStore } from "vuex";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();
import router from "@/router";

export default createStore({
  state() {
    return {
      todoTasks: [],
      apiUrl: "http://quovoyapi.runasp.net/api/items",
      isGettingItems: false, //to show placeholder items
      isCreatingItem: false, //to show the loading button
      isCompletingItem: false, //to show the loading button
      failureMessage: "Oops! Something went wrong. Please try again.",
      itemsPageInfo: {
        //page info for lazy loading
        page: 1, //current page size
        pageSize: 10, //total items per page
        hasMore: false, //whether there is more tasks to load
      },
      isLoadingMoreItems: false,
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
          isCompleted: task.isCompleted,
          dueDate: new Date(task.dueDate).toLocaleString(), // Format the dueDate
        };
      });
    },
    //update the state to show a recently completed item
    //without calling the server
    showCompletedItem(state, id) {
      let currentItems = state.todoTasks;
      state.todoTasks = currentItems.map((task) => {
        return {
          id: task.id,
          title: task.title,
          description: task.description,
          isCompleted: task.id == id ? true : task.isCompleted, //update status of recently completed item
          dueDate: task.dueDate,
        };
      });
    },
    updatePageInfo(state, pageInfo) {
      state.itemsPageInfo = pageInfo;
    },
    //load more tasks
    loadAdditionalTasks(state, tasks) {
      //marge original tasks with new loaded tasks
      let mergedItems = state.todoTasks.concat(tasks);
      state.todoTasks = mergedItems.map((task) => {
        return {
          id: task.id,
          title: task.title,
          description: task.description,
          isCompleted: task.isCompleted,
          dueDate: new Date(task.dueDate).toLocaleString(), // Format the dueDate
        };
      });
    },
  },
  actions: {
    //fetch all tasks
    async fetchTasks({ commit }) {
      try {
        this.state.isGettingItems = true;
        const response = await axios.get(this.state.apiUrl);
        //mutate the state with the fetched tasks
        commit("formatTaskDate", response.data.items);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        this.state.isGettingItems = false;
      }
    },
    //fetch completed tasks
    async fetchCompletedTasks({ commit }) {
      try {
        this.state.isGettingItems = true;
        const response = await axios.get(`${this.state.apiUrl}/completed`);
        //mutate the state with the fetched tasks
        commit("formatTaskDate", response.data.items);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        this.state.isGettingItems = false;
      }
    },
    //fetch uncompleted tasks
    async fetchUncompletedTasks({ commit }) {
      try {
        this.state.isGettingItems = true;
        const response = await axios.get(`${this.state.apiUrl}/uncompleted`);
        //mutate the state with the fetched tasks
        commit("formatTaskDate", response.data.items);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        this.state.isGettingItems = false;
      }
    },

    //Load more tasks
    async loadMoreTasks({ commit }, filterBy) {
      try {
        //check which filter to use
        let filterValue = "";
        if (filterBy == "completed" || filterBy == "uncompleted") {
          filterValue = filterBy;
        }
        this.state.isLoadingMoreItems = true;
        const response = await axios.get(
          `${this.state.apiUrl}/${filterValue}`,
          {
            params: {
              page: this.state.itemsPageInfo.page + 1,
              pageSize: this.state.itemsPageInfo.pageSize,
            },
          }
        );
        //mutate the state with the additional tasks
        commit("loadAdditionalTasks", response.data.items);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        this.state.isLoadingMoreItems = false;
      }
    },

    //add a task
    async addTask({ dispatch }, task) {
      try {
        this.state.isCreatingItem = true;
        const response = await axios.post(this.state.apiUrl, task);
        // Check if the request was successful
        //status code will be 201 from the API
        if (response.status == 201) {
          //show toast success message
          let message = "The task has been successfully added.";
          dispatch("showToast", { message: message, severity: "success" });

          router.push("/tasks");

          //refresh the state
          await dispatch("fetchTasks");
        } else {
          dispatch("showToast", {
            message: this.state.failureMessage,
            severity: "error",
          });
        }
        this.state.isCreatingItem = false;
      } catch (error) {
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });

        console.log(error);
        this.state.isCreatingItem = false;
      }
    },

    //mark a task as completed
    async completeTask({ dispatch, commit }, id) {
      try {
        this.state.isCompletingItem = true;
        let completedTask = {
          isCompleted: true,
        };
        const response = await axios.put(
          `${this.state.apiUrl}/${id}`,
          completedTask
        );
        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //show toast success message
          let message = "The task is done and dusted.";
          dispatch("showToast", { message: message, severity: "success" });

          //update status of recently completed item
          commit("showCompletedItem", id);
        } else {
          dispatch("showToast", {
            message: this.state.failureMessage,
            severity: "error",
          });
        }
        this.state.isCompletingItem = false;
      } catch (error) {
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });
        this.state.isCompletingItem = false;
      }
    },

    // Asynchronous action to delete a task
    async deleteTask({ dispatch }, id) {
      try {
        // Send a DELETE request to the API
        let response = await axios.delete(`${this.state.apiUrl}/${id}`);

        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //show toast success message
          let message = "The task has been successfully deleted.";
          dispatch("showToast", { message: message, severity: "success" });

          //refresh the list of items
          await dispatch("fetchTasks");
        } else {
          dispatch("showToast", {
            message: this.state.failureMessage,
            severity: "error",
          });
        }
      } catch (error) {
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });
      }
    },
    //Show toast notification
    showToast(context, payload) {
      const { message, severity } = payload;

      if (severity == "success") {
        toast.success(message);
      } else if (severity == "error") {
        toast.error(message);
      } else {
        toast(message);
      }
    },
  },
  modules: {},
});
