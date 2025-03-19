import axios from "axios";

const company = {
  namespaced: true,
  state: () => ({
    companies: [], // All companies
    isAddingOrUpdatingCompany: false,
    isGettingCompanies: false,
    isDeletingCompany: false,
    companyFacts: {
      company: {},
      totalYearsInService: 0,
      totalCompletedBookings: 0,
      totalHappyCustomers: 0,
      overallRating: 0,
    },
  }),
  mutations: {
    // Set the companies list
    setCompanies(state, companies) {
      state.companies = companies;
    },
    //set facts about the company
    setCompanyFacts(state, facts) {
      state.companyFacts = facts;
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
    getCompany({ rootState }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/companies/first`)
          .then((response) => resolve(response.data))
          .catch(() => {
            let message =
              "Something went wrong while fetching company details.";
            reject(message);
          });
      });
    },

    // Fetch some facts (e.g years in service) about the company using the company ID
    getCompanyFacts({ commit, rootState }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/companies/${id}/company-facts`)
          .then((response) => {
            commit("setCompanyFacts", response.data);
            resolve();
          })
          .catch((ex) => {
            reject();
            console.log(ex);
          });
      });
    },

    // Add a new company
    addCompany({ dispatch, state, rootState }, { company }) {
      return new Promise((resolve, reject) => {
        state.isAddingOrUpdatingCompany = true;
        dispatch("setAuthorizationHeader");
        axios
          .post(`${rootState.apiUrl}/companies`, company)
          .then(() =>
            resolve("The company information has been successfully added.")
          )
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong while adding the company information.";
            reject(message);
          })
          .finally(() => {
            state.isAddingOrUpdatingCompany = false;
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
          .then(() =>
            resolve("The company information has been successfully removed.")
          )
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
        state.isAddingOrUpdatingCompany = true;
        dispatch("setAuthorizationHeader");
        axios
          .put(`${rootState.apiUrl}/companies/${id}`, updatedCompany)
          .then(() => resolve("The company information has been updated."))
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong. Unable to update the company information.";
            reject(message);
          })
          .finally(() => {
            state.isAddingOrUpdatingCompany = false;
          });
      });
    },

    //Contact us message from user
    contactUs({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isContactingUs = true;
        axios
          .post(`${rootState.apiUrl}/email/contact-us`, payload)
          .then(() => {
            let message =
              "We’ve received your message. Our team will get back to you shortly.";
            resolve(message);
          })
          .catch((error) => {
            const message =
              error.response?.data?.message ||
              "We couldn’t send your message. Please try again in a few minutes.";
            reject(message);
          })
          .finally(() => {
            state.isContactingUs = false;
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
