<template>
  <button @click="$emit('on:click')" class="btn btn-primary">
    <i class="fa fa-2x" :class="icon"></i>
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: false,
      default: "fa-plus",
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  border-radius: 100%;
  bottom: 20px;
  height: 50px;
  position: fixed;
  right: 20px;
  width: 52px;
}
</style>
