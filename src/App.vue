<template>
  <h1 v-if="authStatus === 'authenticating'">Loading...</h1>
  <router-view v-else />
</template>

<script>
import useAuth from "@/modules/auth/composables/useAuth";
export default {
  setup() {
    const { authStatus, checkAuthentication } = useAuth();

    checkAuthentication();

    return {
      authStatus,
    };
  },
};
</script>
