import axios from "axios";
import router from "@/router";
import { useToast } from "vue-toastification";
const toast = useToast();
const bookings = {
  namespaced: true,
  state: () => ({
    bookings: [],
    isGettingBookings: false, //to show placeholder bookings
    isCreatingBooking: false, //to show the loading button during task creation
    isUpdatingBooking: false, //to show the loading button during task completion
    bookingsPageInfo: {
      //page info for lazy loading
      page: 1, //current page size
      pageSize: 10, //total bookings per page
      hasMore: false, //whether there is more tasks to load
    },
    isLoadingMoreBookings: false,
    userStatistics: {
      totalBookings: 0,
      totalCompletedBookings: 0,
      totalPendingBookings: 0,
      totalCancelledBookings: 0,
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
    //update the state to show a recently completed booking
    //without calling the server
    showCompletedBooking(state, id) {
      let currentBookings = state.todoTasks;
      state.todoTasks = currentBookings.map((task) => {
        return {
          id: task.id,
          title: task.title,
          description: task.description,
          isCompleted: task.id == id ? true : task.isCompleted, //update status of recently completed booking
          dueDate: task.dueDate,
        };
      });
    },
    //remove deleted booking from the state
    //without calling the server
    removeBooking(state, id) {
      let currentBookings = state.todoTasks;
      state.todoTasks = currentBookings.filter((task) => task.id != id);
    },
    updatePageInfo(state, pageInfo) {
      state.bookingsPageInfo = pageInfo;
    },
    //load more tasks
    loadAdditionalBookings(state, tasks) {
      //marge original tasks with new loaded tasks
      let mergedBookings = state.todoTasks.concat(tasks);
      state.todoTasks = mergedBookings.map((task) => {
        return {
          id: task.id,
          title: task.title,
          description: task.description,
          isCompleted: task.isCompleted,
          dueDate: new Date(task.dueDate).toLocaleString(), // Format the dueDate
        };
      });
    },
    //set user statistics such as total uncompleted bookings by the user
    setUserStatistics(state, stats) {
      state.userStatistics = stats;
    },
  },
  getters: {},
  actions: {
    //fetch all bookings
    async getBookings({ commit, dispatch, state, rootState }) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        state.isGettingBookings = true;
        const response = await axios.get(`${rootState.apiUrl}/bookings`);
        //mutate the state with the fetched tasks
        commit("formatTaskDate", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        toast.error("Failed to load bookings.");
      } finally {
        state.isGettingBookings = false;
      }
    },

    //fetch completed bookings
    async getCompletedBookings({ commit, dispatch, state, rootState }) {
      try {
        state.isGettingBookings = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.get(
          `${rootState.apiUrl}/bookings/completed`
        );
        //mutate the state with the fetched tasks
        commit("formatTaskDate", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        toast.error("Failed to load bookings.");
      } finally {
        state.isGettingBookings = false;
      }
    },
    //fetch pending bookings
    async getPendingBookings({ commit, dispatch, state, rootState }) {
      try {
        state.isGettingBookings = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.get(
          `${rootState.apiUrl}/bookings/uncompleted`
        );
        //mutate the state with the fetched tasks
        commit("formatTaskDate", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        toast.error("Failed to load bookings.");
      } finally {
        state.isGettingBookings = false;
      }
    },

    //fetch cancelled booking
    async getCancelledBookings({ commit, dispatch, state, rootState }) {
      try {
        state.isGettingBookings = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.get(
          `${rootState.apiUrl}/bookings/cancelled`
        );
        //mutate the state with the fetched tasks
        commit("formatTaskDate", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        toast.error("Failed to load bookings.");
      } finally {
        state.isGettingBookings = false;
      }
    },

    //fetch user statistics such as the number of completed tasks by the user
    async fetchUserStatistics({ commit, dispatch, rootState }) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        const response = await axios.get(
          `${rootState.apiUrl}/bookings/statistics`
        );
        //mutate the state with the fetched statistics
        commit("setUserStatistics", response.data);
      } catch (error) {
        toast.error(rootState.failureMessage);
      }
    },

    //Load more bookings
    async loadMoreBookings({ commit, dispatch, state, rootState }, filterBy) {
      try {
        //check which filter to use
        let filterValue = "";
        if (filterBy == "completed" || filterBy == "uncompleted") {
          filterValue = filterBy;
        }
        state.isLoadingMoreBookings = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.get(
          `${rootState.apiUrl}/bookings/${filterValue}`,
          {
            params: {
              page: state.bookingsPageInfo.page + 1,
              pageSize: state.bookingsPageInfo.pageSize,
            },
          }
        );
        //mutate the state with the additional tasks
        commit("loadAdditionalBookings", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        toast.error("Failed to load more bookings.");
      } finally {
        state.isLoadingMoreBookings = false;
      }
    },

    //add a booking
    async addBooking({ dispatch, state, rootState }, task) {
      try {
        //convert time to UCT
        let localDueDate = task.dueDate;
        task.dueDate = new Date(localDueDate + "Z").toISOString();
        state.isCreatingBooking = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.post(`${rootState.apiUrl}/bookings`, task);
        // Check if the request was successful
        //status code will be 201 from the API
        if (response.status == 201) {
          //show toast success message
          let message = "The booking has been successfully added.";
          dispatch("showToast", { message: message, severity: "success" });

          router.push("/tasks/list");

          //refresh the state
          await dispatch("fetchTasks");
        } else {
          if (response.data.message) {
            toast.error(response.data.message);
          }
        }
        state.isCreatingBooking = false;
      } catch (err) {
        toast.error(rootState.failureMessage);
        state.isCreatingBooking = false;
      }
    },

    //mark a booking as completed
    async updateBooking({ dispatch, commit, state, rootState }, payload) {
      try {
        state.isUpdatingBooking = true;
        let { id, booking } = payload;

        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.put(
          `${rootState.apiUrl}/bookings/${id}`,
          booking
        );
        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //show toast success message
          let message = "The booking has been updated.";
          dispatch("showToast", { message: message, severity: "success" });

          //update status of recently completed booking
          commit("showCompletedBooking", id);
        } else {
          toast.error(rootState.failureMessage);
        }
      } catch (error) {
        toast.error(rootState.failureMessage);
      } finally {
        state.isUpdatingBooking = false;
      }
    },

    async deleteBooking({ dispatch, commit, rootState }, id) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        // Send a DELETE request to the API
        let response = await axios.delete(`${rootState.apiUrl}/bookings/${id}`);

        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //show toast success message
          let message = "The booking has been successfully deleted.";
          toast.success(message);

          //remove booking from state
          await commit("removeBooking", id);
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
      let sessionToken = sessionStorage.getBooking("jwt_token");
      //check if there is a token in local storage
      let localToken = localStorage.getBooking("jwt_token");

      //the current token
      let token = sessionToken ? sessionToken : localToken ? localToken : null;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
  },
};

export default bookings;
