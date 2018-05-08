<template>
  <div class="neva-node-wrap"
  :style="{
    left: viewPositionX,
    top: viewPositionY
  }">
    <div class="node-title">
      <span>{{node.type}}</span>
      <button @click ="deleteNode">X</button>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class NodeUIWrap extends Vue {
  @Prop() node;

  get viewPositionX(){
    return this.node.positionX + 'px';
  }

  get viewPositionY(){
    return this.node.positionY + 'px';
  }

  deleteNode(){
    this.$store.commit('removeNode',this.node);
  }
}

</script>

<style scoped lang="scss">
.neva-node-wrap{
  width:100px;
  height:50px;
  border:1px solid #000;
  position: absolute;
  >.node-title{
    display: flex;
    justify-content: space-between;
    >button{

    }
  }
}

</style>
