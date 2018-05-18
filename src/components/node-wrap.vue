<template>
  <div class="neva-node-wrap"
  @mousemove="makeConnect"
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
    <!-- <div class="connection-hub">
      <svg width="100px" height="100px">
          <path 
          v-for="line in lines"
          :key="line"
          :d="this.svgPath"
          stroke="black" fill="transparent"/>
      </svg>
    </div> -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { createSVGConnectionLine } from '../util/line';
import { ViewFunctionNode } from '../core/view-function-node';

@Component
export default class NodeUIWrap extends Vue {
  @Prop() node:ViewFunctionNode;
  @Prop() boardInfo;

  get viewPositionX(){
    return this.node.positionX - this.boardInfo.offsetX + 'px';
  }

  get viewPositionY(){
    return this.node.positionY- this.boardInfo.offsetY + 'px';
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
    this.originX = this.$el.getBoundingClientRect().left;
    this.originY = this.$el.getBoundingClientRect().top;
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
      node:this.node
    });
    window.addEventListener('mousemove',this.connecting)
    window.addEventListener('mouseup',e=>{
      // console.log('mouse up');
      this.$store.commit('endConnection');
      window.removeEventListener('mousemove', this.connecting);
    })
  }

  makeConnect(e: MouseEvent){
    if(this.$store.state.isConnecting
      && this.$store.state.connectFrom.id !== this.node.id
      && this.node.inputParams[0]){
        this.node.pipeFrom(this.$store.state.connectFrom,
        this.node.inputParams[0].name)
    }
  }

  

  get lines(){
    return this.node.inputParams.filter(para=>{
      return para.valueRef !== null;
    }).map(para=>{
      const nodeBefore = para.valueRef as ViewFunctionNode;
      return createSVGConnectionLine(
        nodeBefore.positionX + nodeBefore.connectEmitorX,
        nodeBefore.positionY + nodeBefore.connectEmitorY,
        this.node.positionX + this.node.connectReceiverX,
        this.node.positionY + this.node.connectReceiverY,
      )
    })
  }

  // get svgWidth(){
  //   this.lines.reduce((lineA,lineB))
  // }

  // get svgHeight(){
    
  // }

  // get verticleOffset(){

  // }
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

.connection-hub{
  position: absolute;
}

</style>
