import axios from "axios";

const company = {
  namespaced: true,
  state: () => ({
    companies: [], // All companies
    isCreatingCompany: false,
    isUpdatingCompany: false,
    isGettingCompanies: false,
    isDeletingCompany: false,
  }),
  mutations: {
    // Set the companies list
    setCompanies(state, companies) {
      state.companies = companies;
    },
  },
  getters: {},
  actions: {
    // Fetch all companies
    getCompanies({ commit, state, rootState }) {
      return new Promise((resolve, reject) => {
        state.isGettingCompanies = true;
        axios
          .get(`${rootState.apiUrl}/companies`)
          .then((response) => {
            // Mutate the state with the fetched companies
            commit("setCompanies", response.data);
            resolve();
          })
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong while fetching companies information.";
            reject(message);
          })
          .finally(() => {
            state.isGettingCompanies = false;
          });
      });
    },

    // Fetch a company by ID
    async getCompany({ rootState }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/companies/${id}`)
          .then((response) => resolve(response.data))
          .catch((ex) => {
            let message =
              ex.status == 404
                ? "The company information you're looking for does not exist."
                : "Something went wrong while fetching company details.";
            reject(message);
          });
      });
    },

 
    // Add a new company
    addCompany({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isCreatingCompany = true;
        dispatch("setAuthorizationHeader");
        axios
          .post(`${rootState.apiUrl}/companies`, payload)
          .then(() => resolve("The company has been successfully added."))
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong while adding the company information.";
            reject(message);
          })
          .finally(() => {
            state.isCreatingCompany = false;
          });
      });
    },

    // Delete a company
    deleteCompany({ dispatch, state, rootState }, id) {
      return new Promise((resolve, reject) => {
        state.isDeletingCompany = true;
        dispatch("setAuthorizationHeader");
        axios
          .delete(`${rootState.apiUrl}/companies/${id}`)
          .then(() => resolve("The company information has been successfully removed."))
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Couldn’t delete the company. Please try again.";
            reject(message);
          })
          .finally(() => {
            state.isDeletingCompany = false;
          });
      });
    },

    // Update a company
    updateCompany({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        let { id, updatedCompany } = payload;
        state.isUpdatingCompany = true;
        dispatch("setAuthorizationHeader");
        axios
          .put(`${rootState.apiUrl}/companies/${id}`, updatedCompany)
          .then(() => resolve("The company has been updated."))
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong. Unable to update the company.";
            reject(message);
          })
          .finally(() => {
            state.isUpdatingCompany = false;
          });
      });
    },

    // Fetch the top-rated company
    async getTopRatedCompany({ rootState }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/companies/top-rated`)
          .then((response) => resolve(response.data))
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong while fetching the top-rated company.";
            reject(message);
          });
      });
    },

    // Set authorization header for all requests to access protected routes
    setAuthorizationHeader() {
      let sessionToken = sessionStorage.getItem("jwt_token");
      let localToken = localStorage.getItem("jwt_token");
      let token = sessionToken ? sessionToken : localToken ? localToken : null;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
  },
};

export default company;
