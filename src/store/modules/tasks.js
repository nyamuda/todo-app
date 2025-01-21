import axios from "axios";
import router from "@/router";
import { useToast } from "vue-toastification";
const toast = useToast();
const tasks = {
  state: () => ({
    todoTasks: [],
    isGettingItems: false, //to show placeholder items
    isCreatingItem: false, //to show the loading button during task creation
    isCompletingItem: false, //to show the loading button during task completion
    itemsPageInfo: {
      //page info for lazy loading
      page: 1, //current page size
      pageSize: 10, //total items per page
      hasMore: false, //whether there is more tasks to load
    },
    isLoadingMoreItems: false,
    userStatistics: {
      totalItems: 0,
      totalCompletedItems: 0,
      totalUncompletedItems: 0,
    },
  }),
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
    //remove deleted item from the state
    //without calling the server
    removeItem(state, id) {
      let currentItems = state.todoTasks;
      state.todoTasks = currentItems.filter((task) => task.id != id);
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
    //set user statistics such as total uncompleted items by the user
    setUserStatistics(state, stats) {
      state.userStatistics = stats;
    },
  },
  getters: {},
  actions: {
    //fetch all tasks
    async fetchTasks({ commit, dispatch, rootState }) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        this.state.isGettingItems = true;
        const response = await axios.get(`${rootState.apiUrl}/items`);
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
    async fetchCompletedTasks({ commit, dispatch, rootState }) {
      try {
        this.state.isGettingItems = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.get(`${rootState.apiUrl}/items/completed`);
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
    async fetchUncompletedTasks({ commit, dispatch, rootState }) {
      try {
        this.state.isGettingItems = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.get(
          `${rootState.apiUrl}/items/uncompleted`
        );
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

    //fetch user statistics such as the number of completed tasks by the user
    async fetchTUserStatistics({ commit, dispatch, rootState }) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        const response = await axios.get(
          `${rootState.apiUrl}/items/statistics`
        );
        //mutate the state with the fetched statistics
        commit("setUserStatistics", response.data);
      } catch (error) {
        toast.error(rootState.failureMessage);
      }
    },

    //Load more tasks
    async loadMoreTasks({ commit, dispatch, rootState }, filterBy) {
      try {
        //check which filter to use
        let filterValue = "";
        if (filterBy == "completed" || filterBy == "uncompleted") {
          filterValue = filterBy;
        }
        this.state.isLoadingMoreItems = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.get(
          `${rootState.apiUrl}/items/${filterValue}`,
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
    async addTask({ dispatch, rootState }, task) {
      try {
        //convert time to UCT
        let localDueDate = task.dueDate;
        task.dueDate = new Date(localDueDate + "Z").toISOString();
        this.state.isCreatingItem = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.post(`${rootState.apiUrl}/items`, task);
        // Check if the request was successful
        //status code will be 201 from the API
        if (response.status == 201) {
          //show toast success message
          let message = "The task has been successfully added.";
          dispatch("showToast", { message: message, severity: "success" });

          router.push("/tasks/list");

          //refresh the state
          await dispatch("fetchTasks");
        } else {
          if (response.data.message) {
            toast.error(response.data.message);
          }
        }
        this.state.isCreatingItem = false;
      } catch (err) {
        toast.error(rootState.failureMessage);
        this.state.isCreatingItem = false;
      }
    },

    //mark a task as completed
    async completeTask({ dispatch, commit, rootState }, id) {
      try {
        this.state.isCompletingItem = true;
        let completedTask = {
          isCompleted: true,
        };
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.put(
          `${rootState.apiUrl}/items/${id}`,
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
          toast.error(rootState.failureMessage);
        }
        this.state.isCompletingItem = false;
      } catch (error) {
        toast.error(rootState.failureMessage);
        this.state.isCompletingItem = false;
      }
    },

    // Asynchronous action to delete a task
    async deleteTask({ dispatch, commit, rootState }, id) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        // Send a DELETE request to the API
        let response = await axios.delete(`${rootState.apiUrl}/items/${id}`);

        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //show toast success message
          let message = "The task has been successfully deleted.";
          toast.success(message);

          //remove item from state
          await commit("removeItem", id);
        } else {
          toast.error(rootState.failureMessage);
        }
      } catch (error) {
        toast.error(rootState.failureMessage);
      }
    },
    //Set authorization header for all request to access protected routes from the API
    setAuthorizationHeader() {
      //check if there is a token in session storage
      let sessionToken = sessionStorage.getItem("jwt_token");
      //check if there is a token in local storage
      let localToken = localStorage.getItem("jwt_token");

      //the current token
      let token = sessionToken ? sessionToken : localToken ? localToken : null;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
  },
};

export default {
  namespaced: true,
  tasks,
};
