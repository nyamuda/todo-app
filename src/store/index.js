import { createStore } from "vuex";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();
import router from "@/router";
import { jwtDecode } from "jwt-decode";

export default createStore({
  state() {
    return {
      todoTasks: [],
      apiUrl: "https://quovoyapi.runasp.net/api/items",
      isGettingItems: false, //to show placeholder items
      isCreatingItem: false, //to show the loading button during task creation
      isCompletingItem: false, //to show the loading button during task completion
      isLoggingIn: false, //to show loading button during log in process
      isRegistering: false, //to show loading button during registering process
      isResettingPassword: false, //to show loading button during password reset process
      failureMessage: "Oops! Something went wrong. Please try again.",
      emailVerificationStatus: "fail",
      itemsPageInfo: {
        //page info for lazy loading
        page: 1, //current page size
        pageSize: 10, //total items per page
        hasMore: false, //whether there is more tasks to load
      },
      isLoadingMoreItems: false,
      googleOauth: {
        clientId:
          "493408617395-dsbcps3dthaspgan66b9jt3auq6iut0v.apps.googleusercontent.com",
        redirectUrl:
          "http://localhost:8080/account/login/oauth/google/callback",
        scope:
          "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        responseType: "code",
      },
      attemptedUrl: "/", //attempted url when user is not authenticated
      loggedInUser: {
        name: "",
        email: "",
      },
      isAuthenticated: false, //is user logged in or not
    };
  },
  getters: {
    googleLoginUrl(state) {
      // Construct the authorization URL with the required parameters
      return `https://accounts.google.com/o/oauth2/auth?client_id=${state.googleOauth.clientId}&redirect_uri=${state.googleOauth.redirectUrl}&response_type=${state.googleOauth.responseType}&scope=${state.googleOauth.scope}`;
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
  },
  actions: {
    //fetch all tasks
    async fetchTasks({ commit }) {
      try {
        this.state.isGettingItems = true;
        const response = await axios.get(this.state.apiUrl);
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
    async fetchCompletedTasks({ commit }) {
      try {
        this.state.isGettingItems = true;
        const response = await axios.get(`${this.state.apiUrl}/completed`);
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
    async fetchUncompletedTasks({ commit }) {
      try {
        this.state.isGettingItems = true;
        const response = await axios.get(`${this.state.apiUrl}/uncompleted`);
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

    //Load more tasks
    async loadMoreTasks({ commit }, filterBy) {
      try {
        //check which filter to use
        let filterValue = "";
        if (filterBy == "completed" || filterBy == "uncompleted") {
          filterValue = filterBy;
        }
        this.state.isLoadingMoreItems = true;
        const response = await axios.get(
          `${this.state.apiUrl}/${filterValue}`,
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
        console.log(localDueDate);
        console.log(task.dueDate);
        this.state.isCreatingItem = true;
        const response = await axios.post(this.state.apiUrl, task);
        // Check if the request was successful
        //status code will be 201 from the API
        if (response.status == 201) {
          //show toast success message
          let message = "The task has been successfully added.";
          dispatch("showToast", { message: message, severity: "success" });

          router.push("/tasks");

          //refresh the state
          await dispatch("fetchTasks");
        } else {
          dispatch("showToast", {
            message: this.state.failureMessage,
            severity: "error",
          });
        }
        this.state.isCreatingItem = false;
      } catch (error) {
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });

        console.log(error);
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
        const response = await axios.put(
          `${this.state.apiUrl}/${id}`,
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
        // Send a DELETE request to the API
        let response = await axios.delete(`${this.state.apiUrl}/${id}`);

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
    async loginUser({ dispatch, commit }, payload) {
      try {
        const { rememberMe, email } = payload;

        this.state.isLoggingIn = true;
        const response = await axios.post(
          `${this.state.apiUrl}/account/login`,
          payload
        );

        // Check if the request was successful
        //status code will be 201 from the API
        if (response.status == 201) {
          //get the access token and decode it
          let accessToken = response.data.token;
          let decodedToken = jwtDecode(accessToken);

          //check user has verified their email or not
          let isVerified = decodedToken.isVerified;
          if (isVerified) {
            let userInfo = {
              name: decodedToken["name"],
              email: decodedToken["email"],
            };
            commit("addUserInfo", userInfo);

            //if the user wants to be be remembered on log in
            //save the JWT token to local storage
            if (rememberMe) {
              localStorage.setItem("jwt_token", accessToken);
            }

            //else save the JWT token to session storage
            else {
              sessionStorage.setItem("jwt_token", accessToken);
            }

            //show toast success message
            let message = "Login successful";
            dispatch("showToast", { message: message });

            router.push(this.state.attemptedUrl);
          }

          //if not verified, send verification email
          else {
            await axios.post(`${this.state.apiUrl}/account/verify`, {
              email: email,
            });

            router.push("/account/verify");
          }
        } else {
          dispatch("showToast", {
            message: response.data.message,
            severity: "error",
          });
        }
      } catch {
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });
      } finally {
        this.state.isLoggingIn = false;
      }
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
          await axios.post(`${this.state.apiUrl}/account/verify`, {
            email: email,
          });
          router.push("/account/verify");
        } else {
          dispatch("showToast", {
            message: response.data.message,
            severity: "error",
          });
        }
      } catch {
        dispatch("showToast", {
          message: this.state.failureMessage,
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
      const { token } = payload;

      try {
        const response = await axios.post(
          `${this.state.apiUrl}/account/verify/token`,
          payload
        );

        // Check if the request was successful
        //status code will be 200 from the API
        if (response.status == 204) {
          //if the token has been verified
          //save it to local storage
          localStorage.setItem("jwt_token", token);

          this.state.emailVerificationStatus = "success";
        } else {
          dispatch("showToast", {
            message: response.data.message,
            severity: "error",
          });
          this.state.emailVerificationStatus = "fail";
        }
      } catch {
        this.state.emailVerificationStatus = "fail";
      }
    },
    //send password reset link to user who has forgotten their password
    async sendPasswordResetLink({ dispatch }, payload) {
      try {
        const { email } = payload;
        const response = await axios.post(
          `${this.state.apiUrl}/account/password/forgot`,
          { email }
        );
        // Check if the request was successful
        //status code will be 200 from the API
        if (response.status == 200) {
          router.push("/account/password/email");
        } else {
          dispatch("showToast", {
            message: response.data.message,
            severity: "error",
          });
        }
      } catch {
        dispatch("showToast", {
          message: this.state.failureMessage,
          severity: "error",
        });
      }
    },
    //allow user to change their password
    //by verifying the reset password token sent to their email
    async resetPassword({ dispatch }, payload) {
      this.state.isResettingPassword = true;
      const { token } = payload;

      try {
        const response = await axios.post(
          `${this.state.apiUrl}/account/password/reset`,
          { token }
        );

        // Check if the request was successful
        //status code will be 200 from the API
        if (response.status == 200) {
          //if the token has been verified
          let message =
            "Your password has been successfully reset. You can now log in with your new password.";
          dispatch("showToast", {
            message: message,
            severity: "success",
          });
          router.push("/account/login");
        } else {
          dispatch("showToast", {
            message: response.data.message,
            severity: "error",
          });
        }
      } catch {
        let message =
          "Password reset failed. Please ensure the link is correct or try again later.";
        dispatch("showToast", {
          message: message,
          severity: "error",
        });
      } finally {
        this.state.isResettingPassword = false;
      }
    },
    //check to see if user is authenticated by using the Jwt token
    authenticateUser({ commit }) {
      //check if there is a token in session storage
      let sessionToken = sessionStorage.getItem("jwt_token");
      //check if there is a token in local storage
      let localToken = localStorage.getItem("jwt_token");

      //the current token
      let token = sessionToken ? sessionToken : localToken ? localToken : "";

      try {
        if (token) {
          //check if token has expired or not
          const decoded = jwtDecode(token);

          // Convert time to seconds
          const currentTime = Date.now() / 1000;

          const hasExpired = decoded.exp > currentTime;

          commit("authenticateUser", hasExpired);
        }
      } catch (error) {
        return false;
      }
    },
  },
  modules: {},
});
