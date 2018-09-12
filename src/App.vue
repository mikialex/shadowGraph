<template>
  <div id="app">
    <div id="nav">
      <router-link to="/" tag="div" class="navitem">index</router-link>
      <router-link to="/about" tag="div" class="navitem">info</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted(){
    
  }
}
</script>


<style lang="scss">
body{
  margin:0px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav{
  width:100vw;
  height: 30px;
  background: #ddd;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  >.navitem{
    padding:3px;
  }
}
</style>
