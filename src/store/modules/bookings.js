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
    isGettingServiceTypes: false,
    userStatistics: {
      totalBookings: 0,
      totalCompletedBookings: 0,
      totalPendingBookings: 0,
      totalCancelledBookings: 0,
    },
  }),
  mutations: {
    setBookings(state, bookings) {
      // mutate state by formatting the date
      state.bookings = bookings;
    },

    updatePageInfo(state, pageInfo) {
      state.bookingsPageInfo = pageInfo;
    },
    //load more bookings
    loadAdditionalBookings(state, bookings) {
      //marge original bookings with new loaded bookings
      let mergedBookings = state.todoTasks.concat(bookings);
      state.todoTasks = mergedBookings;
    },
    //set user statistics such as total uncompleted bookings by the user
    setUserStatistics(state, stats) {
      state.userStatistics = stats;
    },
  },
  getters: {
    //formatting the 'scheduleAt' date of the bookings
    formatAndGetBookings(state) {
      return state.bookings.map((booking) => {
        return {
          id: booking.id,
          vehicleType: booking.vehicleType,
          serviceType: booking.serviceType,
          location: booking.location,
          scheduledAt: new Date(booking.scheduledAt).toLocaleString(), // Format the 'scheduledAt' date
          status: booking.status,
          additionalNotes: booking.additionalNotes,
        };
      });
    },
  },
  actions: {
    //fetch all bookings
    async getBookings({ commit, dispatch, state, rootState }) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        state.isGettingBookings = true;
        const response = await axios.get(`${rootState.apiUrl}/bookings`);
        //mutate the state with the fetched bookings
        commit("setBookings", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (ex) {
        console.log(ex);
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
        commit("setBookings", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        toast.error("Failed to load completed bookings.");
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
        commit("setBookings", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        toast.error("Failed to load pending bookings.");
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
        commit("setBookings", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        toast.error("Failed to load cancelled bookings.");
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
        if (filterBy != "all") {
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
    async addBooking({ dispatch, state, rootState }, booking) {
      try {
        //convert time to UCT
        let localScheduledAt = booking.scheduledAt;
        booking.scheduledAt = new Date(localScheduledAt + "Z").toISOString();
        state.isCreatingBooking = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.post(
          `${rootState.apiUrl}/bookings`,
          booking
        );
        // Check if the request was successful
        //status code will be 201 from the API
        if (response.status == 201) {
          //show toast success message
          let message = "The booking has been successfully added.";
          dispatch("showToast", { message: message, severity: "success" });

          router.push("/bookings/list");

          //refresh the state
          await dispatch("getBookings");
        } else {
          if (response.data.message) {
            toast.error(response.data.message);
          }
        }
      } catch (err) {
        toast.error(rootState.failureMessage);
      } finally {
        state.isCreatingBooking = false;
      }
    },
    //add a booking
    async addGuestBooking({ dispatch, state, rootState }, booking) {
      try {
        //convert time to UCT
        let localScheduledAt = booking.scheduledAt;
        booking.scheduledAt = new Date(localScheduledAt + "Z").toISOString();
        state.isCreatingBooking = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.post(
          `${rootState.apiUrl}/bookings/guest`,
          booking
        );
        // Check if the request was successful
        //status code will be 201 from the API
        if (response.status == 201) {
          //show toast success message
          let message =
            "Your booking has been successfully created. Please check your email.";
          dispatch("showToast", { message: message, severity: "success" });

          router.push("/");
        } else {
          if (response.data.message) {
            toast.error(response.data.message);
          }
        }
      } catch (err) {
        toast.error(rootState.failureMessage);
      } finally {
        state.isCreatingBooking = false;
      }
    },

    //update the booking
    //for now users can only cancel their bookings
    async updateBooking({ dispatch, state, rootState }, payload) {
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
          let message = "The booking has been cancelled.";
          dispatch("showToast", { message: message, severity: "success" });

          //refresh the state
          await dispatch("getBookings");
        } else {
          toast.error(rootState.failureMessage);
        }
      } catch (error) {
        toast.error(rootState.failureMessage);
      } finally {
        state.isUpdatingBooking = false;
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

export default bookings;
