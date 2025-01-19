import { createStore } from "vuex";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();
import router from "@/router";
import { jwtDecode } from "jwt-decode";
import { isJwtExpired } from "jwt-check-expiration";

export default createStore({
  state() {
    return {
      todoTasks: [],
      apiUrl: "https://quovoyapi.runasp.net/api",
      isGettingItems: false, //to show placeholder items
      isCreatingItem: false, //to show the loading button during task creation
      isCompletingItem: false, //to show the loading button during task completion
      isLoggingIn: false, //to show loading button during log in process
      isRegistering: false, //to show loading button during registering process
      isResettingPassword: false, //to show loading button during password reset process
      isContactingUs: false, //to show loading button during contact us process
      failureMessage: "Oops! Something went wrong. Please try again.",
      emailVerificationStatus: "fail",
      isSendingPasswordLink: false,
      itemsPageInfo: {
        //page info for lazy loading
        page: 1, //current page size
        pageSize: 10, //total items per page
        hasMore: false, //whether there is more tasks to load
      },
      isLoadingMoreItems: false,
      googleOauth: {
        clientId:
          "966223459862-clm27dve7uikctc5hh9tf02u585ck85c.apps.googleusercontent.com",
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
      attemptedUrl: "/", //attempted url when user is not authenticated
      loggedInUser: {
        name: "",
        email: "",
      },
      userStatistics: {
        totalItems: 0,
        totalCompletedItems: 0,
        totalUncompletedItems: 0,
      },
      isAuthenticated: false, //is user logged in or not
    };
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
  mutations: {
    formatTaskDate(state, tasks) {
      // mutate state by formatting the date
      state.todoTasks = tasks.map((task) => {
        return {
          id: task.id,
          title: task.title,
          description: task.description,
          isCompleted: task.isCompleted,
          dueDate: new Date(task.dueDate).toLocaleString(), // Format the dueDate
        };
      });
    },
    //update the state to show a recently completed item
    //without calling the server
    showCompletedItem(state, id) {
      let currentItems = state.todoTasks;
      state.todoTasks = currentItems.map((task) => {
        return {
          id: task.id,
          title: task.title,
          description: task.description,
          isCompleted: task.id == id ? true : task.isCompleted, //update status of recently completed item
          dueDate: task.dueDate,
        };
      });
    },
    //remove deleted item from the state
    //without calling the server
    removeItem(state, id) {
      let currentItems = state.todoTasks;
      state.todoTasks = currentItems.filter((task) => task.id != id);
    },
    updatePageInfo(state, pageInfo) {
      state.itemsPageInfo = pageInfo;
    },
    //load more tasks
    loadAdditionalTasks(state, tasks) {
      //marge original tasks with new loaded tasks
      let mergedItems = state.todoTasks.concat(tasks);
      state.todoTasks = mergedItems.map((task) => {
        return {
          id: task.id,
          title: task.title,
          description: task.description,
          isCompleted: task.isCompleted,
          dueDate: new Date(task.dueDate).toLocaleString(), // Format the dueDate
        };
      });
    },
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
  actions: {
    //fetch all tasks
    async fetchTasks({ commit, dispatch }) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        this.state.isGettingItems = true;
        const response = await axios.get(`${this.state.apiUrl}/items`);
        //mutate the state with the fetched tasks
        commit("formatTaskDate", response.data.items);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        this.state.isGettingItems = false;
      }
    },

    //fetch completed tasks
    async fetchCompletedTasks({ commit, dispatch }) {
      try {
        this.state.isGettingItems = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.get(
          `${this.state.apiUrl}/items/completed`
        );
        //mutate the state with the fetched tasks
        commit("formatTaskDate", response.data.items);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        this.state.isGettingItems = false;
      }
    },
    //fetch uncompleted tasks
    async fetchUncompletedTasks({ commit, dispatch }) {
      try {
        this.state.isGettingItems = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.get(
          `${this.state.apiUrl}/items/uncompleted`
        );
        //mutate the state with the fetched tasks
        commit("formatTaskDate", response.data.items);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        this.state.isGettingItems = false;
      }
    },

    //fetch user statistics such as the number of completed tasks by the user
    async fetchTUserStatistics({ commit, dispatch }) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");

        const response = await axios.get(
          `${this.state.apiUrl}/items/statistics`
        );
        //mutate the state with the fetched statistics
        commit("setUserStatistics", response.data);
      } catch (error) {
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });
      }
    },

    //Load more tasks
    async loadMoreTasks({ commit, dispatch }, filterBy) {
      try {
        //check which filter to use
        let filterValue = "";
        if (filterBy == "completed" || filterBy == "uncompleted") {
          filterValue = filterBy;
        }
        this.state.isLoadingMoreItems = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.get(
          `${this.state.apiUrl}/items/${filterValue}`,
          {
            params: {
              page: this.state.itemsPageInfo.page + 1,
              pageSize: this.state.itemsPageInfo.pageSize,
            },
          }
        );
        //mutate the state with the additional tasks
        commit("loadAdditionalTasks", response.data.items);

        //page info
        commit("updatePageInfo", response.data.pageInfo);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        this.state.isLoadingMoreItems = false;
      }
    },

    //add a task
    async addTask({ dispatch }, task) {
      try {
        //convert time to UCT
        let localDueDate = task.dueDate;
        task.dueDate = new Date(localDueDate + "Z").toISOString();
        this.state.isCreatingItem = true;
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.post(`${this.state.apiUrl}/items`, task);
        // Check if the request was successful
        //status code will be 201 from the API
        if (response.status == 201) {
          //show toast success message
          let message = "The task has been successfully added.";
          dispatch("showToast", { message: message, severity: "success" });

          router.push("/tasks/list");

          //refresh the state
          await dispatch("fetchTasks");
        } else {
          if (response.data.message) {
            dispatch("showToast", {
              message: this.response.data.message,
              severity: "error",
            });
          }
        }
        this.state.isCreatingItem = false;
      } catch (err) {
        console.log(err);
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });
        this.state.isCreatingItem = false;
      }
    },

    //mark a task as completed
    async completeTask({ dispatch, commit }, id) {
      try {
        this.state.isCompletingItem = true;
        let completedTask = {
          isCompleted: true,
        };
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        //make the request
        const response = await axios.put(
          `${this.state.apiUrl}/items/${id}`,
          completedTask
        );
        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //show toast success message
          let message = "The task is done and dusted.";
          dispatch("showToast", { message: message, severity: "success" });

          //update status of recently completed item
          commit("showCompletedItem", id);
        } else {
          dispatch("showToast", {
            message: this.state.failureMessage,
            severity: "error",
          });
        }
        this.state.isCompletingItem = false;
      } catch (error) {
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });
        this.state.isCompletingItem = false;
      }
    },

    // Asynchronous action to delete a task
    async deleteTask({ dispatch, commit }, id) {
      try {
        //add authorization header to the request
        //to access the protected route
        dispatch("setAuthorizationHeader");
        // Send a DELETE request to the API
        let response = await axios.delete(`${this.state.apiUrl}/items/${id}`);

        // Check if the request was successful
        //status code will be 204 from the API
        if (response.status == 204) {
          //show toast success message
          let message = "The task has been successfully deleted.";
          dispatch("showToast", { message: message, severity: "success" });

          //remove item from state
          await commit("removeItem", id);
        } else {
          dispatch("showToast", {
            message: this.state.failureMessage,
            severity: "error",
          });
        }
      } catch (error) {
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });
      }
    },
    //Show toast notification
    showToast(context, payload) {
      const { message, severity } = payload;

      if (severity == "success") {
        toast.success(message);
      } else if (severity == "error") {
        toast.error(message);
      } else {
        toast(message);
      }
    },
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
          `${this.state.apiUrl}/account/oauth/google`,
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
          `${this.state.apiUrl}/account/oauth/facebook`,
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
  modules: {},
});
