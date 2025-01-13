<template>
  <div>
    <h1>{{ code }}</h1>

    <button @click="loginWithGoogle" class="btn btn-primary">
      Login with google
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
// Access the store
const store = useStore();

const route = useRouter();
let code = ref("");

onMounted(() => {
  code.value = route.currentRoute.value.query.code ?? "no code";
});

let loginWithGoogle = () => {
  window.location.href = store.getters.googleLoginUrl;
};
</script>
