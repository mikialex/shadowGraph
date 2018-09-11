<template>
  <div>
    graphName: <input type="text" v-model="graphName">
    statues: editing  registered to manger : false
    <div>
      <button @click="exportScene">export</button>
      <button @click="graphCodeGen" :disabled="!canCodeGenGraph">code gen for graph</button>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class GraphInfo extends Vue {

  get graph(){
    return this.$store.state.nodeManager.currentNodeGraph;
  }

  set graphName(newName){

  }
  get graphName(){
    return this.graph.name;
  }

  get manager() {
    return this.$store.state.nodeManager;
  }

  get canCodeGenGraph(){
    return this.graph.returnNode !== null;
  }
  graphCodeGen() {
    return this.graph.codeGen();
  }

  exportScene() {
    console.log(JSON.stringify(this.manager.toJSON()));
  }
};
</script>

<style lang="scss" scoped>
</style>
