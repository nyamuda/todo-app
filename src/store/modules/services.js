import axios from "axios";
import router from "@/router";
import { useToast } from "vue-toastification";
const toast = useToast();
const services = {
  namespaced: true,
  state: () => ({
    services: [], //all car wash service types
    service: null, //car wash service type
    isCreatingService: false,
    isUpdatingService: false,
    isGettingServices: false,
  }),
  mutations: {
    //set the car wash services
    setServices(state, services) {
      state.services = services;
    },
    //set a service
    setService(state, service) {
      state.serviceTypes = service;
    },
  },
  getters: {},
  actions: {
    //fetch all the car wash service types
    async getServices({ commit, state, rootState }) {
      try {
        state.isGettingServices = true;
        const response = await axios.get(`${rootState.apiUrl}/services`);
        //mutate the state with the fetched service types
        commit("setServices", response.data);
        state.isGettingServices = false;
      } catch (error) {
        toast.error("Failed to fetch car wash services.");
        state.isGettingServices = false;
      }
    },
    //fetch service by ID
    async getService({ commit, rootState }, id) {
      try {
        const response = await axios.get(`${rootState.apiUrl}/services/${id}`);
        //mutate the state with the fetched service types
        commit("setService", response.data);
      } catch (error) {
        toast.error("Error fetching service");
      }
    },
    //add a service
    async addService({ dispatch, state, rootState }, payload) {
      try {
        state.isCreatingService = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.post(
          `${rootState.apiUrl}/services`,
          payload
        );
        // Check if the request was successful
        //status code will be 201 from the API
        if (response.status == 201) {
          //show toast success message
          let message = "The service has been successfully added";
          toast.success(message);

          router.push("/services");

          //refresh the state
          await dispatch("getServices");
        } else {
          if (response.data.message) {
            toast.error(response.data.message);
          }
        }
      } catch (err) {
        toast.error(rootState.failureMessage);
      } finally {
        state.isCreatingService = false;
      }
    },
    // Delete a service
    async deleteService({ dispatch, rootState }, id) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        // Send a DELETE request to the API
        let response = await axios.delete(`${rootState.apiUrl}/services/${id}`);

        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //show toast success message
          let message = "The service has been successfully deleted.";
          toast.success(message);

          //refresh the state
          await dispatch("getServices");
        } else {
          toast.error(rootState.failureMessage);
        }
      } catch (error) {
        toast.error(rootState.failureMessage);
      }
    },
    //mark a task as completed
    async updateService({ dispatch, state, rootState }, payload) {
      try {
        let { id, updatedService } = payload;
        state.isUpdatingService = true;

        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.put(
          `${rootState.apiUrl}/services/${id}`,
          updatedService
        );
        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //show toast success message
          let message = "The service has been updated.";
          toast.success(message);

          router.push("/services");
        } else {
          toast.error(rootState.failureMessage);
        }
      } catch (error) {
        toast.error(rootState.failureMessage);
      } finally {
        state.isUpdatingService = false;
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

export default services;
