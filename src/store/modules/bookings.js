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
    isGettingStatistics: false,
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
      totalConfirmedBooking: 0,
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
          booking.status.name = status;
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
    async getBookings(
      { commit, dispatch, state, rootState },
      filterBy = "all"
    ) {
      try {
        let url = `${rootState.apiUrl}/bookings`;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        state.isGettingBookings = true;
        const response = await axios.get(url, {
          params: {
            page: state.bookingsPageInfo.page,
            pageSize: state.bookingsPageInfo.pageSize,
            status: filterBy,
          },
        });
        //mutate the state with the fetched bookings
        commit("setBookings", response.data.bookings);

        //page info
        commit("updatePageInfo", response.data.pageInfo);

        console.log(response.data);
      } catch (ex) {
        toast.error("Failed to fetch bookings.");
      } finally {
        state.isGettingBookings = false;
      }
    },
    //get booking by ID
    getBooking({ rootState, dispatch }, id) {
      dispatch("setAuthorizationHeader");
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/bookings/${id}`)
          .then((response) => resolve(response.data))
          .catch((ex) => {
            let message =
              ex.status == 404
                ? "The booking you're looking for does not exist."
                : rootState.failureMessage;
            reject(message);
          });
      });
    },

    //fetch user statistics such as the number of completed tasks by the user
    async fetchUserStatistics({ commit, dispatch, rootState, state }) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        state.isGettingStatistics = true;

        const response = await axios.get(
          `${rootState.apiUrl}/bookings/statistics`
        );
        //mutate the state with the fetched statistics
        commit("setUserStatistics", response.data);
      } catch (error) {
        toast.error(rootState.failureMessage);
      } finally {
        state.isGettingStatistics = false;
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
    async addBooking({ dispatch, state, rootState }, payload) {
      try {
        let { booking } = payload;
        //convert time to UCT
        // let localScheduledAt = booking.scheduledAt;
        // booking.scheduledAt = new Date(localScheduledAt + "Z").toISOString();
        state.isCreatingBooking = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        //make the request
        await axios.post(`${rootState.apiUrl}/bookings`, booking);
        //show toast success message
        let message = "The booking has been successfully added.";
        dispatch("showToast", { message: message, severity: "success" });

        router.push("/bookings");

        //refresh the state
        await dispatch("getBookings");
      } catch (ex) {
        let message = ex.response
          ? ex.response.data?.message
          : rootState.failureMessage;
        toast.error(message);
      } finally {
        state.isCreatingBooking = false;
      }
    },
    //add a booking
    async addGuestBooking({ dispatch, state, rootState }, payload) {
      try {
        let { booking } = payload;

        //all guest booking fields required by the API
        let guestBooking = {
          guestName: booking.name,
          guestEmail: booking.email,
          guestPhone: booking.phone,
          location: booking.location,
          vehicleType: booking.vehicleType,
          serviceTypeId: booking.serviceTypeId,
          scheduledAt: booking.scheduledAt,
          additionalNotes: booking.additionalNotes,
        };
        state.isCreatingBooking = true;

        //make the request
        const response = await axios.post(
          `${rootState.apiUrl}/bookings/guest`,
          guestBooking
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
      } catch (ex) {
        let message = ex.response
          ? ex.response.data?.message
          : rootState.failureMessage;
        toast.error(message);
      } finally {
        state.isCreatingBooking = false;
      }
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
          let message = "The booking has been cancelled.";
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
    async changeBookingStatus({ dispatch, state, rootState, commit }, payload) {
      try {
        state.isUpdatingBooking = true;
        let { bookingId, statusUpdate } = payload;

        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.put(
          `${rootState.apiUrl}/bookings/${bookingId}/statuses`,
          statusUpdate
        );
        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //update the status the of a booking without reloading the bookings from the API
          commit("updateBookingStatus", {
            id: bookingId,
            status: statusUpdate.statusName,
          });

          //show toast success message
          let message = `The booking status is now ${statusUpdate.statusName}.`;
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

    //add feedback when a booking is completed
    async addFeedback({ dispatch, rootState }, payload) {
      try {
        let { feedback } = payload;

        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        //make the request
        const response = await axios.post(
          `${rootState.apiUrl}/feedback`,
          feedback
        );
        // Check if the request was successful
        //status code will be 201 from the API
        if (response.status == 201) {
          //show toast success message
          let message = "Your feedback has been received. Thank you!";
          dispatch("showToast", { message: message, severity: "success" });

          router.push("/bookings");
          //refresh the state
          await dispatch("getBookings");
        } else {
          if (response.data.message) {
            toast.error(response.data.message);
          }
        }
      } catch (err) {
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

export default bookings;
