<template>
  <div class="text-center mb-3">
    <!-- <p>Sign in with:</p> -->
    <button
      @click="loginWithGoogle"
      type="button"
      class="login-with-google-btn py-2"
    >
      Continue with Google
    </button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// Access the store
const store = useStore();

const route = useRouter();

onMounted(() => {
  //get the code for Oauth from the callback url
  let code = route.currentRoute.value.query.code ?? "";
  //get the state for Oauth from the callback url
  let urlState = route.currentRoute.value.query.state ?? "";

  if (code && urlState) {
    let doStatesMatch = compareStates(urlState);
    //if the states match
    //login user with Oauth by making a request to the backend
    if (doStatesMatch) {
      store.dispatch("loginWithGoogle", { code });
    }
  }
});

let loginWithGoogle = () => {
  //generate the google login url state parameter
  store.dispatch("generateOauthRandomState");
  //navigate to the login page
  window.location.href = store.getters.googleLoginUrl;
};

//Compare two state objects
//One from the Oauth redirect url and and another from session storage
let compareStates = (redirectState) => {
  // Decode and parse the redirect state from the URL
  let urlState = JSON.parse(atob(redirectState));
  let sessionState = getStateFromSessionStorage();

  if (!(urlState && sessionState)) {
    store.dispatch("showToast", {
      message: store.state.failureMessage,
      severity: "error",
    });
    return false;
  }

  //compare the states
  if (
    urlState.randomString === sessionState.randomString &&
    urlState.currentState === sessionState.currentState
  ) {
    //save the state url to redirect the user to the page
    //they were initially wanted to go to when then clicked the oauth button
    store.commit("setAttemptedUrl", urlState.currentState);
    return true;
  }
  //show an error the states don't match
  store.dispatch("showToast", {
    message: store.state.failureMessage,
    severity: "error",
  });
  return false;
};
// Read the Oauth state object from session storage
let getStateFromSessionStorage = () => {
  // Get the JSON string from session storage
  const stateString = sessionStorage.getItem("oauthState");

  // Check if it exists
  if (stateString) {
    // Parse the JSON string into an object
    const stateObject = JSON.parse(stateString);
    return stateObject;
  } else {
    // If it doesn't exist, return null
    return null;
  }
};
</script>
