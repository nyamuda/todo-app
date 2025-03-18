import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { isJwtExpired } from "jwt-check-expiration";

const account = {
  namespaced: true,
  state: () => ({
    isLoggingIn: false, //to show loading button during log in process
    isRegistering: false, //to show loading button during registering process
    isResettingPassword: false, //to show loading button during password reset process
    emailVerificationStatus: "fail",
    isSendingPasswordLink: false,
    isSendingVerificationLink: false,
    isUpdatingAccount: false,
    googleOauth: {
      clientId:
        "966223459862-8scq77jsqaf7ue1028bt4psl4jp7t04k.apps.googleusercontent.com",
      redirectUrl:
        "https://prioritia.netlify.app/account/login/oauth/google/callback",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
      responseType: "code",
      state: "",
    },
    facebookOauth: {
      clientId: "1140074330816834",
      redirectUrl:
        "https://prioritia.netlify.app/account/login/oauth/facebook/callback",

      state: "",
    },
    loggedInUser: {
      name: "",
      email: "",
      isVerified: false,
      isAdmin: false,
    },
    isAuthenticated: false, //is user logged in or not
    attemptedUrl: "/", //attempted url when user is not authenticated
  }),
  mutations: {
    //add logged in user info
    addUserInfo(state, info) {
      state.loggedInUser = info;
    },
    //mark the user as authenticated or not
    authenticateUser(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    //set Url user attempted to access when they're not logged in
    setAttemptedUrl(state, url) {
      state.attemptedUrl = url;
    },

    //set state parameter for Google & Facebook Oauth
    setStateParameter(state, stateParameter) {
      state.googleOauth.state = stateParameter;
      state.facebookOauth.state = stateParameter;
    },
  },
  getters: {
    googleLoginUrl(state) {
      // Construct the authorization URL with the required parameters
      return `https://accounts.google.com/o/oauth2/auth?client_id=${state.googleOauth.clientId}&redirect_uri=${state.googleOauth.redirectUrl}&response_type=${state.googleOauth.responseType}&scope=${state.googleOauth.scope}&state=${state.googleOauth.state}`;
    },
    facebookLoginUrl(state) {
      // Construct the authorization URL with the required parameters
      return `https://www.facebook.com/v21.0/dialog/oauth?client_id=${state.facebookOauth.clientId}&redirect_uri=${state.facebookOauth.redirectUrl}&state=${state.facebookOauth.state}`;
    },
  },
  actions: {
    //login user and get the JWT token

    loginUser({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        const { rememberMe, email, password } = payload;
        const loginDetails = { email, password };
        state.isLoggingIn = true;

        axios
          .post(`${rootState.apiUrl}/account/login`, loginDetails, {
            withCredentials: true, // Attach cookies
          })
          .then(async (response) => {
            // Get the access token and decode it
            const accessToken = response.data.token;
            const decodedToken = jwtDecode(accessToken);

            // Extract the claims (e.g., isVerified)
            //the value of isVerified will be a string ---> "true" / "false"
            //it won't be a boolean
            const isVerified = decodedToken["isVerified"]?.toLowerCase();

            if (isVerified == "true") {
              // Store JWT token based on "remember me" option
              if (rememberMe) {
                localStorage.setItem("jwt_token", accessToken);
              } else {
                sessionStorage.setItem("jwt_token", accessToken);
              }
            }
            resolve({ isVerified });
          })
          .catch((error) => {
            const message =
              error.response?.data?.message ||
              "There was an issue with your login. Please try again.";
            reject(message); // Reject with the error message
          })
          .finally(() => {
            state.isLoggingIn = false; // Reset loading state
          });
      });
    },

    // Google OAuth login
    loginWithGoogle({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isLoggingIn = true;
        axios
          .post(`${rootState.apiUrl}/oauth/google`, payload)
          .then(async (response) => {
            // Get the access token and save it to local storage
            const accessToken = response.data.token.result;
            localStorage.setItem("jwt_token", accessToken);

            try {
              // Mark the user as authenticated
              dispatch("authenticateUser");
              resolve("You have successfully logged in."); // Resolve with response data
            } catch {
              reject("Unexpected response from server");
            }
          })
          .catch((error) => {
            const message =
              error.response?.data?.message ||
              "There was an issue with your login. Please try again.";
            reject(message); // Reject with the error message
          })
          .finally(() => {
            state.isLoggingIn = false; // Always reset loading state
          });
      });
    },

    // Login user with Facebook OAuth
    loginWithFacebook({ dispatch, state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isLoggingIn = true;

        axios
          .post(`${rootState.apiUrl}/oauth/facebook`, payload)
          .then(async (response) => {
            // Get the access token
            const accessToken = response.data.token.result;

            // Save the JWT token to local storage
            localStorage.setItem("jwt_token", accessToken);

            // Mark the user as authenticated
            try {
              await dispatch("authenticateUser");
              resolve("You have successfully logged in."); // Resolve with response data
            } catch (authError) {
              reject(authError); // Reject if authentication fails
            }
          })
          .catch((error) => {
            const message =
              error.response?.data?.message ||
              "There was an issue with your login. Please try again.";
            reject(message); // Reject with the error message
          })
          .finally(() => {
            state.isLoggingIn = false; // Reset loading state
          });
      });
    },

    //get user by email
    getUserByEmail({ rootState, dispatch }, email) {
      dispatch("setAuthorizationHeader");
      return new Promise((resolve, reject) => {
        axios
          .get(`${rootState.apiUrl}/users/email/${email}`)
          .then((response) => resolve(response.data))
          .catch((ex) => {
            let message =
              ex.status == 404
                ? "Something went wrong. Unable to fetch account details."
                : ex.response.data.message;
            reject(message);
          });
      });
    },

    // When the user logs out
    logoutUser({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          //first, remove access token from local or session storage
          localStorage.removeItem("jwt_token");
          sessionStorage.removeItem("jwt_token");

          // Clear the default authorization header
          delete axios.defaults.headers.common["Authorization"];
          //second, clear the user info from the state
          let userInfo = {
            name: "",
            email: "",
          };
          commit("addUserInfo", userInfo);

          //third, mark the user as unauthenticated
          commit("authenticateUser", false);
          let message = "You’re now logged out.";
          resolve(message);
        } catch {
          reject("Something went wrong while logging you out. Please retry.");
        }
      });
    },
    //Register user
    registerUser({ rootState, state }, payload) {
      return new Promise((resolve, reject) => {
        state.isRegistering = true;
        const { email } = payload;
        axios
          .post(`${rootState.apiUrl}/account/register`, payload)
          .then(async () => {
            try {
              //send verification email
              await axios.post(`${rootState.apiUrl}/email/verify`, {
                email: email,
              });
              resolve("An email has been sent for verification.");
            } catch (error) {
              const message =
                error.response?.data?.message ||
                "An error occurred during registration. Please try again.";
              reject(message);
            }
          })
          .catch((error) => {
            const message =
              error.response?.data?.message ||
              "An error occurred during registration. Please try again.";
            reject(message); // Reject with the error message
          })
          .finally(() => (state.isRegistering = false));
      });
    },

    //Update user details
    updateAccount({ rootState, state, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        state.isUpdatingAccount = true;
        let { id, updatedDetails } = payload;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        axios
          .put(`${rootState.apiUrl}/users/${id}`, updatedDetails)
          .then(() => {
            resolve("Your account details have been updated.");
          })
          .catch((error) => {
            const message =
              error.response?.data?.message ||
              "Couldn’t update the account details. Please try again.";
            reject(message);
          })
          .finally(() => (state.isUpdatingAccount = false));
      });
    },

    //send verification link to user to verify their email
    sendEmailVerificationLink({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isSendingVerificationLink = true;

        axios
          .post(`${rootState.apiUrl}/email/verification-request`, payload)
          .then(() => {
            let message =
              "Email verification link sent. Please check your inbox and follow the instructions to confirm your email.";
            resolve(message); // Resolve on successful request
          })
          .catch((error) => {
            console.log(error);
            const message =
              error.response?.data?.message || rootState.failureMessage;
            reject(message); // Reject with the error message
          })
          .finally(() => {
            state.isSendingVerificationLink = false; // Reset loading state
          });
      });
    },

    //verify user email address
    //by verifying the token sent to their email
    async verifyUser({ state, rootState }, payload) {
      state.emailVerificationStatus = "verifying";
      try {
        await axios.put(`${rootState.apiUrl}/account/verification`, payload);
        state.emailVerificationStatus = "success";
      } catch (ex) {
        state.emailVerificationStatus = "fail";
      }
    },
    //send password reset link to user who has forgotten their password
    // Send password reset link
    sendPasswordResetLink({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isSendingPasswordLink = true;

        axios
          .post(`${rootState.apiUrl}/email/reset-password-request`, payload)
          .then(() => {
            resolve("Password reset email sent."); // Resolve on successful request
          })
          .catch((error) => {
            const message =
              error.response?.data?.message || rootState.failureMessage;
            reject(message); // Reject with the error message
          })
          .finally(() => {
            state.isSendingPasswordLink = false; // Reset loading state
          });
      });
    },

    //allow user to change their password
    //by verifying the reset password token sent to their email
    // Reset user password
    resetPassword({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isResettingPassword = true;
        axios
          .post(`${rootState.apiUrl}/account/reset-password`, payload)
          .then(() => {
            resolve("Your password has been successfully reset.");
          })
          .catch((error) => {
            const message =
              error.response?.data?.message || rootState.failureMessage;
            reject(message); // Reject with the error message
          })
          .finally(() => {
            state.isResettingPassword = false; // Reset loading state
          });
      });
    },

    //check to see if user is authenticated by using the Jwt token
    authenticateUser({ commit, dispatch }) {
      //check if there is a token in session storage
      let sessionToken = sessionStorage.getItem("jwt_token");
      //check if there is a token in local storage
      let localToken = localStorage.getItem("jwt_token");

      //the current token
      let token = sessionToken ? sessionToken : localToken ? localToken : "";

      try {
        if (token) {
          //check if access token has expired or not
          const hasExpired = isJwtExpired(token);
          //if token has expired, then the user is not authenticated
          const isUserAuthenticated = hasExpired ? false : true;

          //if token hasn't expired
          //decode access token and load user info
          if (!hasExpired) {
            dispatch("decodeTokenAndLoadInfo", { token });
          }
          commit("authenticateUser", isUserAuthenticated);
        } else {
          commit("authenticateUser", false);
        }
      } catch (error) {
        commit("authenticateUser", false);
      }
    },
    //Contact us message from user
    contactUs({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        state.isContactingUs = true;
        axios
          .post(`${rootState.apiUrl}/email/contact-message`, payload)
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

    //Refresh the access token
    //using the an HTTP-Only cookie containing the refresh token in the request --> withCredentials:true
    refreshToken({ state, rootState, dispatch }) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${rootState.apiUrl}/account/refresh-token`,
            {},
            { withCredentials: true } // Send cookies
          )
          .then((response) => {
            //get the access token
            let accessToken = response.data.token;

            //decode the token and save the user info to the state
            dispatch("decodeTokenAndLoadInfo", { token: accessToken });

            //save the token to local storage
            //first remove any outdated tokens in the local or session storage
            localStorage.removeItem("jwt_token");
            sessionStorage.removeItem("jwt_token");

            //then finally save new access token
            localStorage.setItem("jwt_token", accessToken);
          })
          .catch(() => {
            const message =
              "Something went wrong while refreshing your session.";
            reject(message); // Reject with the error message
          })
          .finally(() => {
            state.isSendingPasswordLink = false; // Reset loading state
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

    //decode access token and load user info
    decodeTokenAndLoadInfo({ commit }, payload) {
      let { token } = payload;
      let decodedToken = jwtDecode(token);
      // Extract the claims (name, isVerified, role etc.)
      const name =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const email =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ];
      const role =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      let isVerified = decodedToken["isVerified"];
      let isAdmin = role == "Admin" ? true : false;

      //store user information
      let userInfo = {
        name: name,
        email: email,
        isVerified,
        isAdmin,
      };
      commit("addUserInfo", userInfo);
    },

    //Generate the state parameter for Oauth 2.0
    // ---> to prevent CSRF & and preserve the application state
    generateOauthRandomState({ commit, state }) {
      // Generate a random string for security
      const randomString = Math.random().toString(36).substring(2);

      // Create the state object
      const stateObject = {
        randomString: randomString,
        currentState: state.attemptedUrl, //current state of the app or attempted url
      };

      // Convert the state object to a JSON string
      const stateString = JSON.stringify(stateObject);

      // Save it to session storage
      sessionStorage.setItem("oauthState", stateString);

      //encode it
      let encodedState = btoa(stateString);

      //save it
      commit("setStateParameter", encodedState);
    },
  },
};

export default account;
