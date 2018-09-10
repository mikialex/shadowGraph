<template>
  <div>
    <button @click="exportScene">export</button>
    
  </div>
</template>

<script>
export default {
  methods: {
    exportScene() {
      console.log(JSON.stringify(this.manager.toJSON()));
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
