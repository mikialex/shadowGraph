<template>
  <div class="neva-node-wrap"
  :style="{
    left: viewPositionX,
    top: viewPositionY
  }">
    <div class="node-title">
      <span draggable="false">{{node.type}}</span>
      <button @mousedown="startdrag">=</button>
      <button @click ="deleteNode">X</button>
      <button @mousedown ="startConnection">-></button>
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

  isDraging = false;
  originX = 0;
  originY = 0;
  screenOriginX =0;
  screenOriginY =0;
  dragging(e:MouseEvent){
    this.node.positionX = this.originX + e.screenX - this.screenOriginX ;
    this.node.positionY = this.originY + e.screenY - this.screenOriginY;
  }
  startdrag(e: MouseEvent){
    this.isDraging = true;
    this.originX = this.$el.offsetLeft;
    this.originY = this.$el.offsetTop;
    this.screenOriginX = e.screenX;
    this.screenOriginY = e.screenY;
    window.addEventListener('mousemove',this.dragging)
    window.addEventListener('mouseup',e=>{
      // console.log('mouse up');
      window.removeEventListener('mousemove', this.dragging);
    })
  }

  connecting(e:MouseEvent){
      this.$store.commit('connectingUpdate' , {
        x:e.clientX,
        y:e.clientY,
      });
  }

  startConnection(e: MouseEvent){
    this.isDraging = true;
    this.$store.commit('startConnection',{
      x:e.clientX,
      y:e.clientY,
    });
    window.addEventListener('mousemove',this.connecting)
    window.addEventListener('mouseup',e=>{
      // console.log('mouse up');
      this.$store.commit('endConnection');
      window.removeEventListener('mousemove', this.connecting);
    })
  }
}

</script>

<style scoped lang="scss">
.neva-node-wrap{
  width:100px;
  height:50px;
  border:1px solid #000;
  position: absolute;
  background: #fff;
  >.node-title{
    display: flex;
    justify-content: space-between;
    >button{

    }
    >span{
      user-select: none;
    }
  }
}

</style>
