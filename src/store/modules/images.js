import axios from "axios";
const images = {
  namespaced: true,
  state: () => ({
    isUploadingImage: false,

    isDeletingImage: false,
  }),
  mutations: {},
  getters: {},
  actions: {
    //upload image
    uploadImage({ state, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        axios
          .post(`${state.apiUrl}/images`, payload)
          .then((response) => resolve(response.data))
          .catch((ex) => {
            let message =
              ex.response?.data?.message ||
              "Something went wrong. Unable to upload the image.";
            reject(message);
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

export default images;
