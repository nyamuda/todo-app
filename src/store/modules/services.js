import axios from "axios";
const services = {
  namespaced: true,
  state: () => ({
    services: [], //all car wash service types
    isCreatingService: false,
    isUpdatingService: false,
    isGettingServices: false,
    isDeletingService: false,
  }),
  mutations: {
    //set the car wash services
    setServices(state, services) {
      state.services = services;
    },
  },
  getters: {},
  actions: {
    //fetch all the car wash service types
    getServices({ commit, state, rootState }) {
      return new Promise((resolve, reject) => {
        state.isGettingServices = true;
        axios
          .get(`${rootState.apiUrl}/services`)
          .then((response) => {
            //mutate the state with the fetched service types
            commit("setServices", response.data);
            resolve();
          })
          .catch(() => {
            reject(rootState.failureMessage);
          })
          .finally(() => {
            state.isGettingServices = false;
          });
      });
    },
    //fetch service by ID
    async getService({ rootState }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/services/${id}`)
          .then((response) => resolve(response.data))
          .catch((ex) => {
            let message = ex.response?.data.message
              ? ex.response.data.message
              : rootState.failureMessage;
            reject(message);
          });
      });
    },
    //add a service
    addService({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isCreatingService = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        axios
          .post(`${rootState.apiUrl}/services`, payload)
          .then(() => resolve("The service has been successfully added."))
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong while adding the service.";
            reject(message);
          })
          .finally(() => {
            state.isCreatingService = false;
          });
      });
    },
    // Delete a service
    deleteService({ dispatch, state, rootState }, id) {
      return new Promise((resolve, reject) => {
        state.isDeletingService = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        // Send a DELETE request to the API
        axios
          .delete(`${rootState.apiUrl}/services/${id}`)
          .then(() => resolve("The service has been successfully deleted."))
          .catch((ex) => {
            console.log(ex);
            let message =
              ex.response?.data?.message ||
              "Couldn’t delete the service. Please try again.";
            reject(message);
          })
          .finally(() => {
            state.isDeletingService = false;
          });
      });
    },
    //Update a car wash service
    updateService({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        let { id, updatedService } = payload;
        state.isUpdatingService = true;

        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        axios
          .put(`${rootState.apiUrl}/services/${id}`, updatedService)
          .then(() => resolve("The service has been updated."))
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong. Unable to update the service.";
            reject(message);
          })
          .finally(() => {
            state.isUpdatingService = false;
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

export default services;
