<template>
  <div class="neva-node-wrap"
  :style="{
    left: viewPositionX,
    top: viewPositionY
  }">

    <div class="menu" v-if="hasExpandMenu">
      <button @click ="deleteNode">delete node</button>
      <button @click ="log">code gen</button>
      <button @click="hasExpandMenu = false">close</button>
    </div>
    <div class="menu-mask" v-if="hasExpandMenu" @click="hasExpandMenu = false"></div>

    <div class="node-title"
    :class="{'canteval-node':!node.canEval}">
      <span draggable="false">{{node.name}}</span>
    </div>
    <div class="node-opration">
      <button @mousedown="startdrag">=</button>
      <button @click="hasExpandMenu = true">m</button>

      <button 
      v-if="canConnect"
      @mousedown ="startConnection">-></button>
    </div>
    <div class="connection-inputs" @mousemove="makeConnect">
      <div
      v-for="input in node.inputParams"
      :key="input.name"
      :class="input.name"
      >
        {{input.name}}
        <button class="remove-dep"
        v-if="input.valueRef"
        @click="removeDependency(input)">-</button>
      </div>
    </div>
    <!-- <div>
      value: {{node.value}}
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
  @Prop({
    default:true,
    required:false,
    type:Boolean
  }) canConnect;

  get viewPositionX(){
    return this.node.positionX - this.boardInfo.offsetX + 'px';
  }

  get viewPositionY(){
    return this.node.positionY- this.boardInfo.offsetY + 'px';
  }

  log(){
    console.log(this.node.codeGen());
  }

  deleteNode(){
    this.$store.commit('removeNode',this.node);
  }

  removeDependency(input) {
    this.node.removeDependencyByNodeParam(input);
  }

  hasExpandMenu = false;

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
      && (e.target as HTMLElement).className){
        this.node.pipeFrom(this.$store.state.connectFrom,
        (e.target as HTMLElement).className);
        this.node.updateGraphValue();
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
  min-height:50px;
  border:1px solid #000;
  position: absolute;
  background: #fff;
  font-size:12px;
  >.node-title{
    display: flex;
    justify-content: center;
    >span{
      user-select: none;
    }
  }
}

.node-opration{
  display: flex;
  justify-content: space-around;
  flex-grow: 1;
}

.connection-inputs{
  // position: absolute;
  >div{
    border:solid #000 1px;
    height:15px;
    display: flex;
    justify-content: space-between;
  }
}

.menu{
  z-index:9999;
  position:absolute;
  top:0px;
  right:0px;
  >button{
    width:80px;
    height:20px;
    background: #fff;
    margin:0px;
    border:0px;
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.123);
  }
}

.menu-mask{
  z-index: 9998;
  position: fixed;
  top:0px;
  left:0px;
  width:100vw;
  height:100vh;
}

.remove-dep{
  width:10px;
  height: 10px;
}

.canteval-node{
  color:#f00;
}

</style>
