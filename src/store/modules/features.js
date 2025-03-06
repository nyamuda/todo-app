import axios from "axios";
//Feature types e.g "cancelled", "confirmed", "en route" etc
const features = {
  namespaced: true,
  state: () => ({
    features: [],
    isCreatingFeature: false,
    isUpdatingFeature: false,
    isGettingFeatures: false,
    isLoadingMoreFeatures: false,
    isDeletingFeature: false,
    pageInfo: {
      //page info for lazy loading
      page: 1, //current page size
      pageSize: 10, //total features per page
      hasMore: false, //whether there is more features to load
    },
  }),
  mutations: {
    //set the car wash feature types
    setFeatures(state, features) {
      state.features = features;
    },
    updatePageInfo(state, pageInfo) {
      state.pageInfo = pageInfo;
    },
    //load more bookings
    loadAdditionalBookings(state, bookings) {
      //marge original bookings with new loaded bookings
      let mergedBookings = state.bookings.concat(bookings);
      state.bookings = mergedBookings;
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
            commit("setFeatures", response.data.features);

            //save the pagination info
            commit("updatePageInfo", response.data.pageInfo);
            console.log(response);

            resolve();
          })
          .catch(() => {
            reject("Failed to fetch features.");
          })
          .finally(() => {
            state.isGettingFeatures = false;
          });
      });
    },

    //Load more features
    loadMoreFeatures({ commit, dispatch, state, rootState }) {
      return new Promise((resolve, reject) => {
        state.isLoadingMoreFeatures = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        axios
          .get(`${rootState.apiUrl}/features`, {
            params: {
              page: state.pageInfo.page + 1,
              pageSize: state.pageInfo.pageSize,
            },
          })
          .then((response) => {
            //mutate the state with the additional tasks
            commit("loadAdditionalFeatures", response.data.features);
            //page info
            commit("updatePageInfo", response.data.pageInfo);
            resolve();
          })
          .catch(() => {
            reject("Failed to load more features. Please try again.");
          })
          .finally(() => {
            state.isLoadingMoreFeatures = false;
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
