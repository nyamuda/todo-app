import axios from "axios";
//Booking statuses e.g "cancelled", "confirmed", "en route" etc
const statuses = {
  namespaced: true,
  state: () => ({
    statuses: [],
    isCreatingStatus: false,
    isUpdatingStatus: false,
    isGettingStatuses: false,
    isDeletingStatus: false,
  }),
  mutations: {
    //set the car wash statuses
    setStatuses(state, statuses) {
      state.statuses = statuses;
    },
  },
  getters: {
    //since statuses are to filter bookings
    //include the "all" value when filtering bookings
    //to show all bookings
  },
  actions: {
    //fetch all the car wash status types
    getStatuses({ commit, state, rootState }) {
      return new Promise((resolve, reject) => {
        state.isGettingStatuses = true;
        axios
          .get(`${rootState.apiUrl}/statuses`)
          .then((response) => {
            //mutate the state with the fetched status types
            commit("setStatuses", response.data);
            resolve();
          })
          .catch(() => {
            reject("Something went wrong while fetching statuses.");
          })
          .finally(() => {
            state.isGettingStatuses = false;
          });
      });
    },
    //fetch status by ID
    async getStatus({ rootState }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/statuses/${id}`)
          .then((response) => resolve(response.data))
          .catch((ex) => {
            let message =
              ex.response.data?.message ||
              "Something went wrong. Unable to fetch the status.";
            reject(message);
          });
      });
    },
    //fetch status by name
    async getStatusByName({ rootState }, name) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/statuses/name/${name}`)
          .then((response) => resolve(response.data))
          .catch((ex) => {
            let message =
              ex.response.data?.message ||
              "Something went wrong. Unable to fetch the status.";
            reject(message);
          });
      });
    },
    //add a status
    addStatus({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isCreatingStatus = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        axios
          .post(`${rootState.apiUrl}/statuses`, payload)
          .then(() => {
            //show toast success message
            let message = "The status has been successfully added.";
            resolve(message);
          })
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong while adding the status.";
            reject(message);
          })
          .finally(() => {
            state.isCreatingStatus = false;
          });
      });
    },
    // Delete a status
    deleteStatus({ dispatch, state, rootState }, id) {
      return new Promise((resolve, reject) => {
        state.isDeletingStatus = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        // Send a DELETE request to the API
        axios
          .delete(`${rootState.apiUrl}/statuses/${id}`)
          .then(() => {
            let message = "The status has been successfully deleted.";
            resolve(message);
          })
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Couldn’t delete the status. Please try again.";
            reject(message);
          })
          .finally(() => {
            state.isDeletingStatus = false;
          });
      });
    },
    //mark a task as completed
    updateStatus({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        let { id, updatedStatus } = payload;
        state.isUpdatingStatus = true;

        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        axios
          .put(`${rootState.apiUrl}/statuses/${id}`, updatedStatus)
          .then(() => resolve("The status has been updated."))
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong. Unable to update the status";
            reject(message);
          })
          .finally(() => {
            state.isDeletingStatus = false;
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

export default statuses;
