import axios from "axios";
import router from "@/router";
import { useToast } from "vue-toastification";
const toast = useToast();
//Booking statuses e.g "cancelled", "confirmed", "en route" etc
const statuses = {
  namespaced: true,
  state: () => ({
    statuses: [],
    isCreatingStatus: false,
    isUpdatingStatus: false,
    isGettingStatuses: false,
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
    async getStatuses({ commit, state, rootState }) {
      try {
        state.isGettingStatuses = true;
        const response = await axios.get(`${rootState.apiUrl}/statuses`);
        //mutate the state with the fetched status types
        commit("setStatuses", response.data);
        state.isGettingStatuses = false;
      } catch (error) {
        toast.error("Failed to fetch car wash statuses.");
        state.isGettingStatuses = false;
      }
    },
    //fetch status by ID
    async getStatus({ rootState }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/statuses/${id}`)
          .then((response) => resolve(response.data))
          .catch((ex) => {
            let message = ex.response?.data.message
              ? ex.response.data.message
              : rootState.failureMessage;
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
            let message = ex.response?.data.message
              ? ex.response.data.message
              : rootState.failureMessage;
            reject(message);
          });
      });
    },
    //add a status
    async addStatus({ dispatch, state, rootState }, payload) {
      try {
        state.isCreatingStatus = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        await axios.post(`${rootState.apiUrl}/statuses`, payload);
        //show toast success message
        let message = "The status has been successfully added";
        toast.success(message);

        router.push("/statuses");

        //refresh the state
        await dispatch("getStatuses");
      } catch (ex) {
        let message = ex.response.data?.message
          ? ex.response.data.message
          : rootState.failureMessage;
        toast.error(message);
      } finally {
        state.isCreatingStatus = false;
      }
    },
    // Delete a status
    async deleteStatus({ dispatch, rootState }, id) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        // Send a DELETE request to the API
        let response = await axios.delete(`${rootState.apiUrl}/statuses/${id}`);

        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //show toast success message
          let message = "The status has been successfully deleted.";
          toast.success(message);

          //refresh the state
          await dispatch("getStatuses");
        } else {
          toast.error(rootState.failureMessage);
        }
      } catch (error) {
        toast.error(rootState.failureMessage);
      }
    },
    //mark a task as completed
    async updateStatus({ dispatch, state, rootState }, payload) {
      try {
        let { id, updatedStatus } = payload;
        state.isUpdatingStatus = true;

        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.put(
          `${rootState.apiUrl}/statuses/${id}`,
          updatedStatus
        );
        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //show toast success message
          let message = "The status has been updated.";
          toast.success(message);

          router.push("/statuses");
        } else {
          toast.error(rootState.failureMessage);
        }
      } catch (error) {
        toast.error(rootState.failureMessage);
      } finally {
        state.isUpdatingStatus = false;
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

export default statuses;
