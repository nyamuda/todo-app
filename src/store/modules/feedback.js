import axios from "axios";

const feedback = {
  namespaced: true,
  state: () => ({
    feedback: [],
    isGettingFeedback: false, // to show placeholder feedback while loading
    isSendingFeedback: false, // to show loading state when submitting feedback
    feedbackPageInfo: {
      page: 1, // current page
      pageSize: 10, // total feedback per page
      hasMore: false, // whether there is more feedback to load
    },
    isLoadingMoreFeedback: false,
  }),
  mutations: {
    setFeedback(state, feedback) {
      state.feedback = feedback;
    },

    updatePageInfo(state, pageInfo) {
      state.feedbackPageInfo = pageInfo;
    },
    loadAdditionalFeedback(state, feedback) {
      state.feedback = state.feedback.concat(feedback);
    },
  },
  getters: {},
  actions: {
    // Fetch all feedback for a particular service
    getFeedback({ commit, state, rootState }, serviceId) {
      return new Promise((resolve, reject) => {
        let url = `${rootState.apiUrl}/services/${serviceId}`;
        state.isGettingFeedback = true;
        axios
          .get(url)
          .then((response) => {
            commit("setFeedback", response.data.feedback);
            commit("updatePageInfo", response.data.pageInfo);
            resolve(response.data.feedback);
          })
          .catch(() => {
            reject("Something went wrong while fetching reviews.");
          })
          .finally(() => {
            state.isGettingFeedback = false;
          });
      });
    },

    // Load more feedback for a particular service
    loadMoreFeedback({ commit, state, rootState }, serviceId) {
      return new Promise((resolve, reject) => {
        state.isLoadingMoreFeedback = true;
        let url = `${rootState.apiUrl}/services/${serviceId}`;
        axios
          .get(url, {
            params: {
              page: state.feedbackPageInfo.page + 1,
              pageSize: state.feedbackPageInfo.pageSize,
              serviceTypeId: serviceId,
            },
          })
          .then((response) => {
            commit("loadAdditionalFeedback", response.data.feedback);
            commit("updatePageInfo", response.data.pageInfo);
            resolve();
          })
          .catch(() => {
            reject("Failed to load more reviews. Please try again.");
          })
          .finally(() => {
            state.isLoadingMoreFeedback = false;
          });
      });
    },

    // Submit feedback
    addFeedback({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        let { feedback } = payload;
        state.isSendingFeedback = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        axios
          .post(`${rootState.apiUrl}/feedback`, feedback)
          .then(() => {
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

    // Set authorization header
    setAuthorizationHeader() {
      let sessionToken = sessionStorage.getItem("jwt_token");
      let localToken = localStorage.getItem("jwt_token");
      let token = sessionToken ? sessionToken : localToken ? localToken : null;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
  },
};

export default feedback;
