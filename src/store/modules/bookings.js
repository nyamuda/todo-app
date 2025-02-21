import axios from "axios";
const bookings = {
  namespaced: true,
  state: () => ({
    bookings: [],
    isGettingBookings: false, //to show placeholder bookings
    isCreatingGuestBooking: false, //to show the loading button during guest booking creation
    isCreatingMemberBooking: false, //to show the loading button during member booking creation
    isUpdatingBooking: false, //to show the loading button when a booking is being updated
    isGettingStatistics: false,
    isSendingFeedback: false,
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
      totalConfirmedBookings: 0,
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
  getters: {},
  actions: {
    //fetch all bookings
    getBookings({ commit, dispatch, state, rootState }, filterBy) {
      return new Promise((resolve, reject) => {
        let url = `${rootState.apiUrl}/bookings`;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        state.isGettingBookings = true;
        axios
          .get(url, {
            params: {
              status: filterBy,
            },
          })
          .then((response) => {
            //mutate the state with the fetched bookings
            commit("setBookings", response.data.bookings);

            //save the pagination info
            commit("updatePageInfo", response.data.pageInfo);

            resolve(response.data.bookings);
          })
          .catch(() => {
            reject("Something went wrong while fetching bookings.");
          })
          .finally(() => {
            state.isGettingBookings = false;
          });
      });
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
    fetchUserStatistics({ commit, dispatch, rootState, state }) {
      return new Promise((resolve, reject) => {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        state.isGettingStatistics = true;
        axios
          .get(`${rootState.apiUrl}/bookings/statistics`)
          .then((response) => {
            //mutate the state with the fetched statistics
            commit("setUserStatistics", response.data);
            resolve();
          })
          .catch(() => {
            reject("Couldn't fetch your booking summary.");
          })
          .finally(() => {
            state.isGettingStatistics = false;
          });
      });
    },

    //Load more bookings
    loadMoreBookings({ commit, dispatch, state, rootState }, filterBy) {
      return new Promise((resolve, reject) => {
        state.isLoadingMoreBookings = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        axios
          .get(`${rootState.apiUrl}/bookings?status=${filterBy}`, {
            params: {
              page: state.bookingsPageInfo.page + 1,
              pageSize: state.bookingsPageInfo.pageSize,
            },
          })
          .then((response) => {
            //mutate the state with the additional tasks
            commit("loadAdditionalBookings", response.data.bookings);
            //page info
            commit("updatePageInfo", response.data.pageInfo);
            resolve();
          })
          .catch(() => {
            reject("Failed to load more bookings. Please try again.");
          })
          .finally(() => {
            state.isLoadingMoreBookings = false;
          });
      });
    },

    //add a booking
    addBooking({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        let { booking } = payload;
        //convert time to UCT
        // let localScheduledAt = booking.scheduledAt;
        // booking.scheduledAt = new Date(localScheduledAt + "Z").toISOString();
        state.isCreatingMemberBooking = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        //make the request
        axios
          .post(`${rootState.apiUrl}/bookings`, booking)
          .then(() => {
            //show toast success message
            let message = "Booking created.";
            resolve(message);
          })
          .catch((ex) => {
            let message =
              ex.response?.data?.message || rootState.failureMessage;
            reject(message);
          })
          .finally(() => {
            state.isCreatingMemberBooking = false;
          });
      });
    },
    //add a booking
    addGuestBooking({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
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
        state.isCreatingGuestBooking = true;

        //make the request
        axios
          .post(`${rootState.apiUrl}/bookings/guest`, guestBooking)
          .then(() => {
            let message = "Booking created! We've emailed you the details.";
            resolve(message);
          })
          .catch(() => {
            reject("Something went wrong. Couldn’t create your booking.");
          })
          .finally(() => {
            state.isCreatingGuestBooking = false;
          });
      });
    },

    //update the booking
    updateBooking({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isUpdatingBooking = true;
        let { id, booking } = payload;

        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        axios
          .put(`${rootState.apiUrl}/bookings/${id}`, booking)
          .then(() => {
            //show toast success message
            let message = "The booking has been updated.";
            resolve(message);
            //router.push(`/bookings/${id}/details`);
          })
          .catch((ex) => {
            let message =
              ex.response?.data?.message || rootState.failureMessage;

            reject(message);
          })
          .finally(() => {
            state.isUpdatingBooking = false;
          });
      });
    },

    //change booking status
    async changeBookingStatus({ dispatch, rootState }, payload) {
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
            let message = `The booking status is now ${statusUpdate.statusName}.`;
            resolve(message);
          })

          .catch((ex) => {
            let message = ex.response.dat?.message
              ? ex.response.data?.message
              : rootState.failureMessage;
            reject(message);
          });
      });
    },

    //add feedback when a booking is completed
    addFeedback({ dispatch, rootState, state }, payload) {
      return new Promise((resolve, reject) => {
        let { feedback } = payload;
        state.isSendingFeedback = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        axios
          .post(`${rootState.apiUrl}/feedback`, feedback)
          .then(() => {
            //toast success message
            let message = "Your feedback has been received. Thank you!";
            resolve(message);
          })
          .catch(() => {
            reject("Failed to submit feedback. Please try again.");
          })
          .finally(() => {
            state.isSendingFeedback = false;
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

export default bookings;
