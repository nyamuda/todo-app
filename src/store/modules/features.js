import axios from "axios";
//Feature types e.g "cancelled", "confirmed", "en route" etc
const features = {
  namespaced: true,
  state: () => ({
    features: [],
    isCreatingFeature: false,
    isUpdatingFeature: false,
    isGettingFeatures: false,
    isDeletingFeature: false,
  }),
  mutations: {
    //set the car wash feature types
    setFeatures(state, features) {
      state.features = features;
    },
  },
  getters: {
    //since features are to filter bookings
    //include the "all" value when filtering bookings
    //to show all bookings
  },
  actions: {
    //fetch all the car wash feature types
    getFeatures({ commit, state, rootState }) {
      return new Promise((resolve, reject) => {
        state.isGettingFeatures = true;
        axios
          .get(`${rootState.apiUrl}/features`)
          .then((response) => {
            //mutate the state with the fetched feature types
            commit("setFeatures", response.data);
            resolve();
          })
          .catch(() => {
            reject(rootState.failureMessage);
          })
          .finally(() => {
            state.isGettingFeatures = false;
          });
      });
    },
    //fetch feature by ID
    async getFeature({ rootState }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/features/${id}`)
          .then((response) => resolve(response.data))
          .catch((ex) => {
            let message = ex.response?.data.message
              ? ex.response.data.message
              : rootState.failureMessage;
            reject(message);
          });
      });
    },
    //fetch feature by name
    async getFeatureByName({ rootState }, name) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/features/name/${name}`)
          .then((response) => resolve(response.data))
          .catch((ex) => {
            let message = ex.response?.data.message
              ? ex.response.data.message
              : rootState.failureMessage;
            reject(message);
          });
      });
    },
    //add a feature
    addFeature({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isCreatingFeature = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        axios
          .post(`${rootState.apiUrl}/features`, payload)
          .then(() => {
            //show toast success message
            let message = "The feature has been successfully added.";
            resolve(message);
          })
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong while adding the feature.";
            reject(message);
          })
          .finally(() => {
            state.isCreatingFeature = false;
          });
      });
    },
    // Delete a feature
    deleteFeature({ dispatch, state, rootState }, id) {
      return new Promise((resolve, reject) => {
        state.isDeletingFeature = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        // Send a DELETE request to the API
        axios
          .delete(`${rootState.apiUrl}/features/${id}`)
          .then(() => {
            let message = "The feature has been successfully deleted.";
            resolve(message);
          })
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Couldn’t delete the feature. Please try again.";
            reject(message);
          })
          .finally(() => {
            state.isDeletingFeature = false;
          });
      });
    },
    //update a feature
    updateFeature({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        let { id, updatedFeature } = payload;
        state.isUpdatingFeature = true;

        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        axios
          .put(`${rootState.apiUrl}/features/${id}`, updatedFeature)
          .then(() => resolve("The feature has been updated."))
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong. Unable to update the feature.";
            reject(message);
          })
          .finally(() => {
            state.isDeletingFeature = false;
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

export default features;
