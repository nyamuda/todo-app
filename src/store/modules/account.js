import axios from "axios";
import router from "@/router";
import { jwtDecode } from "jwt-decode";
import { isJwtExpired } from "jwt-check-expiration";

export const account = {
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
    //set user statistics such as total uncompleted items by the user
    setUserStatistics(state, stats) {
      state.userStatistics = stats;
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
    async loginUser({ dispatch }, payload) {
      try {
        const { rememberMe, email, password } = payload;
        let loginDetails = { email, password };
        this.state.isLoggingIn = true;
        const response = await axios.post(
          `${this.state.apiUrl}/account/login`,
          loginDetails
        );

        // Check if the request was successful
        //status code will be 200 from the API
        if (response.status == 200) {
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

            dispatch("showToast", { message: message, severity: "success" });

            router.push(this.state.attemptedUrl);
          }

          //if not verified, send verification email
          else {
            await axios.post(`${this.state.apiUrl}/email/verify`, {
              email: email,
            });

            router.push("/email/verify");
          }
        } else {
          dispatch("showToast", {
            message: response.data.message,
            severity: "error",
          });
        }
      } catch (ex) {
        let message = ex.response.data.message
          ? ex.response.data.message
          : this.state.failureMessage;
        dispatch("showToast", {
          message: message,
          severity: "error",
        });
      } finally {
        this.state.isLoggingIn = false;
      }
    },
    async loginWithGoogle({ dispatch }, payload) {
      try {
        let { code } = payload;
        console.log(code);
        const response = await axios.post(
          `${this.state.apiUrl}/oauth/google`,
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

          dispatch("showToast", { message: message, severity: "success" });

          router.push(this.state.attemptedUrl);
        }
      } catch (ex) {
        console.log(ex);
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });
      } finally {
        this.state.isLoggingIn = false;
      }
    },
    async loginWithFacebook({ dispatch }, payload) {
      try {
        const response = await axios.post(
          `${this.state.apiUrl}/oauth/facebook`,
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

          dispatch("showToast", { message: message, severity: "success" });

          router.push(this.state.attemptedUrl);
        }
      } catch (ex) {
        console.log(ex);
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });
      } finally {
        this.state.isLoggingIn = false;
      }
    },

    // When the user logs out
    logoutUser({ dispatch, commit }) {
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
      let message = "You’re now logged out";
      dispatch("showToast", {
        message: message,
        severity: "success",
      });
    },
    //Register user
    async registerUser({ dispatch }, payload) {
      try {
        const { email } = payload;

        this.state.isRegistering = true;
        const response = await axios.post(
          `${this.state.apiUrl}/account/register`,
          payload
        );

        // Check if the request was successful
        //status code will be 201 from the API
        if (response.status == 201) {
          //send verification email
          await axios.post(`${this.state.apiUrl}/email/verify`, {
            email: email,
          });
          router.push("/email/verify");
        } else {
          dispatch("showToast", {
            message: response.data.message,
            severity: "error",
          });
        }
      } catch (ex) {
        let message = ex.response.data.message
          ? ex.response.data.message
          : this.state.failureMessage;
        dispatch("showToast", {
          message: message,
          severity: "error",
        });
      } finally {
        this.state.isRegistering = false;
      }
    },
    //verify user email address
    //by verifying the token sent to their email
    async verifyUser({ dispatch }, payload) {
      this.state.emailVerificationStatus = "verifying";
      try {
        await axios.put(`${this.state.apiUrl}/account/verify`, payload);
        this.state.emailVerificationStatus = "success";
      } catch (ex) {
        console.log(ex);
        this.state.emailVerificationStatus = "fail";
        dispatch("showToast", {
          message: ex.response.data.message,
          severity: "error",
        });
      }
    },
    //send password reset link to user who has forgotten their password
    async sendPasswordResetLink({ dispatch }, payload) {
      try {
        this.state.isSendingPasswordLink = true;
        await axios.post(`${this.state.apiUrl}/email/password`, payload);
        router.push("/email/password/sent");
      } catch (ex) {
        let message =
          ex.status == 400
            ? ex.response.data.message
            : this.state.failureMessage;

        dispatch("showToast", {
          message: message,
          severity: "error",
        });
      } finally {
        this.state.isSendingPasswordLink = false;
      }
    },
    //allow user to change their password
    //by verifying the reset password token sent to their email
    async resetPassword({ dispatch }, payload) {
      this.state.isResettingPassword = true;

      try {
        await axios.post(
          `${this.state.apiUrl}/account/password-reset`,
          payload
        );
        let message =
          "Your password has been successfully reset. You can now log in with your new password.";
        dispatch("showToast", {
          message: message,
          severity: "success",
        });
        router.push("/account/login");
      } catch (ex) {
        let message =
          ex.status == 400
            ? ex.response.data.message
            : this.state.failureMessage;
        dispatch("showToast", {
          message: message,
          severity: "error",
        });
      } finally {
        this.state.isResettingPassword = false;
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
          const isUserAuthenticated = hasExpired ? false : true;

          //if token hasn't expired
          //decode access token and load user info
          if (!hasExpired) {
            dispatch("decodeTokenAndLoadInfo", { token });
          }
          commit("authenticateUser", isUserAuthenticated);
        }
      } catch (error) {
        return false;
      }
    },
    //Contact us message from user
    async contactUs({ dispatch }, payload) {
      try {
        this.state.isContactingUs = true;
        await axios.post(`${this.state.apiUrl}/email/contact`, payload);
        let message =
          "We’ve received your message. Our team will get back to you shortly.";
        dispatch("showToast", {
          message: message,
          severity: "success",
        });
        router.push("/");
      } catch (ex) {
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });
      } finally {
        this.state.isContactingUs = false;
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
      // Extract the claims (name, isVerified etc.)
      const name =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const email =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ];
      let isVerified = decodedToken["isVerified"];

      //store user information
      let userInfo = {
        name: name,
        email: email,
        isVerified,
      };
      commit("addUserInfo", userInfo);
    },

    //Generate the state parameter for Oauth 2.0
    // ---> to prevent CSRF & and preserve the application state
    generateOauthRandomState({ commit }) {
      // Generate a random string for security
      const randomString = Math.random().toString(36).substring(2);

      // Create the state object
      const stateObject = {
        randomString: randomString,
        currentState: this.state.attemptedUrl, //current state of the app or attempted url
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
