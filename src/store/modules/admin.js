import axios from "axios";
import router from "@/router";
import { useToast } from "vue-toastification";
const toast = useToast();
const admin = {
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
    adminStatistics: {
      totalBookings: 0,
      totalCompletedBookings: 0,
      totalPendingBookings: 0,
      totalConfirmedBookings: 0,
      totalCancelledBookings: 0,
      totalRevenue: 0,
    },
  }),
  mutations: {
    setBookings(state, bookings) {
      // mutate state by formatting the date
      state.bookings = bookings;
    },
    //update the status the of an updated booking without reloading the bookings from the API
    updateBookingStatus(state, { id, status }) {
      let updatedBookings = state.bookings.map((booking) => {
        if (booking.id == id) {
          //change the status
          booking.status = status;
          return booking;
        }
        return booking;
      });
      state.bookings = updatedBookings;
    },
    updatePageInfo(state, pageInfo) {
      state.bookingsPageInfo = pageInfo;
    },
    //load more bookings
    loadAdditionalBookings(state, bookings) {
      //marge original bookings with new loaded bookings
      let mergedBookings = state.bookings.concat(bookings);
      state.bookings = mergedBookings;
    },
    //set admin statistics such as total bookings
    setAdminStatistics(state, stats) {
      state.adminStatistics = stats;
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
        const response = await axios.get(`${rootState.apiUrl}/admin/bookings`);
        //mutate the state with the fetched tasks
        commit("setBookings", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (ex) {
        toast.error("Failed to fetch bookings.");
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
          `${rootState.apiUrl}/admin/bookings/completed`
        );
        //mutate the state with the fetched tasks
        commit("setBookings", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        toast.error("Failed to fetch completed bookings.");
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
          `${rootState.apiUrl}/admin/bookings/pending`
        );
        //mutate the state with the fetched tasks
        commit("setBookings", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        toast.error("Failed to fetch pending bookings.");
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
          `${rootState.apiUrl}/admin/bookings/cancelled`
        );
        //mutate the state with the fetched tasks
        commit("setBookings", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        toast.error("Failed to fetch cancelled bookings.");
      } finally {
        state.isGettingBookings = false;
      }
    },

    //fetch admin statistics such as the total number of completed bookings
    async fetchAdminStatistics({ commit, dispatch, rootState }) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        const response = await axios.get(
          `${rootState.apiUrl}/admin/statistics`
        );
        //mutate the state with the fetched statistics
        commit("setAdminStatistics", response.data);
      } catch (ex) {
        let message = ex.response
          ? ex.response.data?.message
          : rootState.failureMessage;
        toast.error(message);
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
          `${rootState.apiUrl}/admin/bookings/${filterValue}`,
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
      } catch (ex) {
        let message = ex.response
          ? ex.response.data?.message
          : "Failed to load more bookings.";
        toast.error(message);
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

          router.push("/admin/bookings");

          //refresh the state
          await dispatch("getBookings");
        } else {
          if (response.data.message) {
            toast.error(response.data.message);
          }
        }
      } catch (ex) {
        let message = ex.response
          ? ex.response.data?.message
          : rootState.failureMessage;
        toast.error(message);
      } finally {
        state.isCreatingBooking = false;
      }
    },
    //delete booking
    deleteBooking({ rootState, dispatch }, id) {
      dispatch("setAuthorizationHeader");
      return new Promise((resolve, reject) => {
        axios
          .delete(`${rootState.apiUrl}/admin/bookings/${id}`)
          .then(() => resolve("The booking was successfully deleted."))
          .catch((ex) => {
            let message = ex.response
              ? ex.response.data?.message
              : rootState.failureMessage;
            reject(message);
          });
      });
    },

    //update the booking
    async updateBooking({ dispatch, state, rootState, commit }, payload) {
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
          //update the status the of a booking without reloading the bookings from the API
          commit("updateBookingStatus", { id: id, status: booking.status });

          //show toast success message
          let message = "The booking has been updated.";
          toast.success(message);
        } else {
          toast.error(rootState.failureMessage);
        }
      } catch (ex) {
        let message = ex.response
          ? ex.response.data?.message
          : rootState.failureMessage;
        toast.error(message);
      } finally {
        state.isUpdatingBooking = false;
      }
    },

    //change booking status
    changeBookingStatus({ dispatch, rootState }, payload) {
      let { bookingId, statusUpdate } = payload;

      return new Promise((resolve, reject) => {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        axios
          .put(
            `${rootState.apiUrl}/admin/bookings/${bookingId}/statuses`,
            statusUpdate
          )
          .then(() => {
            let message = `The booking status has been changed to ${statusUpdate.statusName}.`;
            resolve(message);
          })

          .catch((ex) => {
            let message = ex.response
              ? ex.response.data?.message
              : rootState.failureMessage;
            reject(message);
          });
      });
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

export default admin;
