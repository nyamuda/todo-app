import axios from "axios";
import router from "@/router";
import { jwtDecode } from "jwt-decode";
import { isJwtExpired } from "jwt-check-expiration";
import { useToast } from "vue-toastification";
const toast = useToast();

const account = {
  namespaced: true,
  state: () => ({
    isLoggingIn: false, //to show loading button during log in process
    isRegistering: false, //to show loading button during registering process
    isResettingPassword: false, //to show loading button during password reset process
    emailVerificationStatus: "fail",
    isSendingPasswordLink: false,
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
    async loginUser({ dispatch, state, rootState }, payload) {
      try {
        const { rememberMe, email, password } = payload;
        let loginDetails = { email, password };
        state.isLoggingIn = true;
        const response = await axios.post(
          `${rootState.apiUrl}/account/login`,
          loginDetails
        );

        //get the access token and decode it
        let accessToken = response.data.token;
        let decodedToken = jwtDecode(accessToken);

        // Extract the claims (name, isVerified etc.)
        let isVerified = decodedToken["isVerified"];

        if (isVerified) {
          //if the user wants to be be remembered on log in
          //save the JWT token to local storage
          if (rememberMe) {
            localStorage.setItem("jwt_token", accessToken);
          }

          //else save the JWT token to session storage
          else {
            sessionStorage.setItem("jwt_token", accessToken);
          }

          //mark the user as authenticated
          dispatch("authenticateUser");

          //show toast success message
          let message = "Login successful";

          toast.success(message);

          router.push(state.attemptedUrl);
        }

        //if not verified, send verification email
        else {
          await axios.post(`${rootState.apiUrl}/email/verify`, {
            email: email,
          });

          router.push("/email/verify");
        }
      } catch (ex) {
        console.log(ex);
        let message = ex.response?.data.message
          ? ex.response.data.message
          : rootState.failureMessage;
        toast.error(message);
      } finally {
        state.isLoggingIn = false;
      }
    },
    async loginWithGoogle({ dispatch, state, rootState }, payload) {
      try {
        let { code } = payload;
        console.log(code);
        const response = await axios.post(
          `${rootState.apiUrl}/oauth/google`,
          payload
        );

        if (response.status == 200) {
          //get the access token and decode it
          let accessToken = response.data.token.result;

          //save the JWT token to local storage
          localStorage.setItem("jwt_token", accessToken);

          //mark the user as authenticated
          dispatch("authenticateUser");

          //show toast success message
          let message = "You’re signed in!";

          toast.success(message);

          router.push(state.attemptedUrl);
        }
      } catch (ex) {
        toast.error(rootState.failureMessage);
      } finally {
        state.isLoggingIn = false;
      }
    },
    async loginWithFacebook({ dispatch, state, rootState }, payload) {
      try {
        const response = await axios.post(
          `${rootState.apiUrl}/oauth/facebook`,
          payload
        );

        if (response.status == 200) {
          //get the access token and decode it
          let accessToken = response.data.token.result;

          //save the JWT token to local storage
          localStorage.setItem("jwt_token", accessToken);

          //mark the user as authenticated
          dispatch("authenticateUser");

          //show toast success message
          let message = "You’re signed in!";
          toast.success(message);
          router.push(state.attemptedUrl);
        }
      } catch (ex) {
        toast.error(rootState.failureMessage);
      } finally {
        state.isLoggingIn = false;
      }
    },

    // When the user logs out
    logoutUser({ commit }) {
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

      //finally, navigate to the homepage and show logged out message
      router.push("/");
      let message = "You’re now logged out.";
      toast.success(message);
    },
    //Register user
    async registerUser({ rootState, state }, payload) {
      try {
        const { email } = payload;

        state.isRegistering = true;
        await axios.post(`${rootState.apiUrl}/account/register`, payload);

        //send verification email
        await axios.post(`${rootState.apiUrl}/email/verify`, {
          email: email,
        });
        router.push("/email/verify");
      } catch (ex) {
        console.log(ex);
        let message = ex.response.data?.message
          ? ex.response.data.message
          : rootState.failureMessage;
        toast.error(message);
      } finally {
        state.isRegistering = false;
      }
    },
    //verify user email address
    //by verifying the token sent to their email
    async verifyUser({ state, rootState }, payload) {
      state.emailVerificationStatus = "verifying";
      try {
        await axios.put(`${rootState.apiUrl}/account/verify`, payload);
        state.emailVerificationStatus = "success";
      } catch (ex) {
        state.emailVerificationStatus = "fail";
        toast.error(ex.response.data.message);
      }
    },
    //send password reset link to user who has forgotten their password
    async sendPasswordResetLink({ state, rootState }, payload) {
      try {
        state.isSendingPasswordLink = true;
        await axios.post(`${rootState.apiUrl}/email/password`, payload);
        router.push("/email/password/sent");
      } catch (ex) {
        let message =
          ex.status == 400
            ? ex.response.data?.message
            : rootState.failureMessage;

        toast.error(message);
      } finally {
        state.isSendingPasswordLink = false;
      }
    },
    //allow user to change their password
    //by verifying the reset password token sent to their email
    async resetPassword({ state, rootState }, payload) {
      state.isResettingPassword = true;

      try {
        await axios.post(`${rootState.apiUrl}/account/password-reset`, payload);
        let message =
          "Your password has been successfully reset. You can now log in with your new password.";
        toast.success(message);
        router.push("/account/login");
      } catch (ex) {
        let message =
          ex.status == 400
            ? ex.response.data?.message
            : rootState.failureMessage;
        toast.error(message);
      } finally {
        state.isResettingPassword = false;
      }
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
    async contactUs({ state, rootState }, payload) {
      try {
        state.isContactingUs = true;
        await axios.post(`${rootState.apiUrl}/email/contact`, payload);
        let message =
          "We’ve received your message. Our team will get back to you shortly.";
        toast.success(message);
        router.push("/");
      } catch (ex) {
        toast.error(rootState.failureMessage);
      } finally {
        state.isContactingUs = false;
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
