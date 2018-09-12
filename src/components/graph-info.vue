<template>
  <div>
    graphName: <input type="text" v-model="graphName">
    statues: editing  registered to manger : false
    <div>
      <button @click="clear">clear</button>
      <button @click="load">load</button>
      <button @click="exportScene">export</button>
      <button @click="graphCodeGen" :disabled="!canCodeGenGraph">code gen for graph</button>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {loadStringFromFile} from '@/util/file-io.ts';

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
    console.log(this.graph.codeGen());
  }

  exportScene() {
    console.log(JSON.stringify(this.manager.toJSON()));
  }

  clear(){
    this.graph.clear();
  }

  async load(){
    const str = await loadStringFromFile();
    console.log(str);
    if(str !== ''){
      try {
        const data = JSON.parse(str);
        this.manager.load(data);
      } catch (error) {
        console.log('load error\n' + error)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
