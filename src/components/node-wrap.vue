<template>
  <div class="neva-node-wrap"
  :style="{
    left: viewPositionX,
    top: viewPositionY,
  }">

  <div v-if="node.isReturnNode" class="return-flag">RETURN</div>
  <div v-if="node.isGraphInput" class="return-flag">{{node.graphInputName}}</div>

    <div class="menu" v-if="hasExpandMenu">
      <button @click ="deleteNode">delete node</button>
      <button @click ="log">code gen</button>
      <button @click="cancelInputDefine" v-if="node.isGraphInput">cancel input define</button>
      <button @click="defineAsInputNode" v-if="node.isInputNode && !node.isGraphInput">define as input node</button>
      <button @click="defineAsReturnNode">define as return node</button>
      <button @click="hasExpandMenu = false">close</button>
    </div>
    <div class="menu-mask" v-if="hasExpandMenu" @click="hasExpandMenu = false"></div>

    <div class="node-title" @mousedown="startdrag"
      :style="{cursor: this.isDraging? 'grabbing': ''}"
    :class="{'canteval-node':!node.canEval}">
      <span>{{node.name}}</span>
    </div>

    <div class="node-opration">
      <button @click="hasExpandMenu = true">m</button>
      <div 
      class="export-point"
      v-if="canConnect"
      @mousedown ="startConnection">
      </div>
    </div>

    <div class="connection-inputs" 
    v-if="!node.isInputNode"
    @mousemove="makeConnect">
      <div
      class="connection-input"
      v-for="input in node.inputParams"
      :key="input.name"
      :dataPara="input.name"
      >
        <div class="input-point"
        v-if="input.valueRef"
        @click="removeDependency(input)"></div>
        {{input.name}}
      </div>
    </div>
    <!-- <div>
      value: {{node.value}}
    </div> -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { createSVGConnectionLine } from "../util/line";
import { ViewFunctionNode } from "../core/view-function-node";

@Component
export default class NodeUIWrap extends Vue {
  @Prop() node: ViewFunctionNode;
  @Prop() boardInfo;
  @Prop({
    default: true,
    required: false,
    type: Boolean
  })
  canConnect;

  get viewPositionX() {
    return this.node.positionX - this.boardInfo.offsetX + "px";
  }

  get viewPositionY() {
    return this.node.positionY - this.boardInfo.offsetY + "px";
  }

  log() {
    console.log(this.node.codeGen());
  }

  defineAsInputNode(){
    this.$store.commit("defineGraphInput", {node:this.node, name: 'myname'+ Math.random()});
    this.hasExpandMenu = false;
  }
  cancelInputDefine(){
    this.$store.commit("cancleGraphInputDefine", this.node);
    this.hasExpandMenu = false;
  }

  defineAsReturnNode(){
    this.$store.commit("defineGraphReturn", this.node);
    this.hasExpandMenu = false;
  }

  deleteNode() {
    this.$store.commit("removeNode", this.node);
    this.hasExpandMenu = false
  }

  removeDependency(input) {
    this.node.removeDependencyByNodeParam(input);
  }

  hasExpandMenu = false;

  isDraging = false;
  originX = 0;
  originY = 0;
  screenOriginX = 0;
  screenOriginY = 0;
  dragging(e: MouseEvent) {
    this.node.positionX = this.originX + e.screenX - this.screenOriginX;
    this.node.positionY = this.originY + e.screenY - this.screenOriginY;
  }
  startdrag(e: MouseEvent) {
    this.isDraging = true;
    this.originX = this.$el.getBoundingClientRect().left;
    this.originY = this.$el.getBoundingClientRect().top;
    this.screenOriginX = e.screenX;
    this.screenOriginY = e.screenY;
    window.addEventListener("mousemove", this.dragging);
    window.addEventListener("mouseup", e => {
      this.isDraging = false;
      window.removeEventListener("mousemove", this.dragging);
    });
  }

  connecting(e: MouseEvent) {
    this.$store.commit("connectingUpdate", {
      x: e.clientX,
      y: e.clientY
    });
  }

  startConnection(e: MouseEvent) {
    this.isDraging = true;
    this.$store.commit("startConnection", {
      x: e.clientX,
      y: e.clientY,
      node: this.node
    });
    window.addEventListener("mousemove", this.connecting);
    window.addEventListener("mouseup", e => {
      // console.log('mouse up');
      this.$store.commit("endConnection");
      window.removeEventListener("mousemove", this.connecting);
    });
  }

  makeConnect(e: MouseEvent) {
    if (
      this.$store.state.isConnecting &&
      this.$store.state.connectFrom.id !== this.node.id &&
      (e.target as HTMLElement).attributes.getNamedItem("dataPara")
    ) {
      const port = (e.target as HTMLElement).attributes.getNamedItem("dataPara")
        .nodeValue;
      this.node.pipeFrom(this.$store.state.connectFrom, port);
      this.node.updateGraphValue();
    }
  }

  get lines() {
    return this.node.inputParams
      .filter(para => {
        return para.valueRef !== null;
      })
      .map(para => {
        const nodeBefore = para.valueRef as ViewFunctionNode;
        return createSVGConnectionLine(
          nodeBefore.positionX + nodeBefore.connectEmitorX,
          nodeBefore.positionY + nodeBefore.connectEmitorY,
          this.node.positionX + this.node.connectReceiverX,
          this.node.positionY + this.node.connectReceiverY
        );
      });
  }

}
</script>

<style scoped lang="scss">
.neva-node-wrap {
  width: 100px;
  min-height: 50px;
  border: 1px solid #999;
  border-radius: 3px;
  position: absolute;
  background: #fff;
  user-select: none;
  font-size: 12px;
  > .node-title {
    display: flex;
    cursor: grab;
    justify-content: center;
    border-bottom: 1px solid #ddd;
  }
}

.export-point {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  border: 1px solid #ddd;
  margin: 3px;
}

.node-opration {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.connection-inputs {
  > .connection-input {
    border-top: solid #eee 1px;
    height: 15px;
    display: flex;
    > .input-point {
      width: 10px;
      height: 10px;
      border-radius: 100%;
      border: 1px solid #ddd;
      margin: 2px;
    }
  }
}

.menu {
  z-index: 9999;
  position: absolute;
  top: 0px;
  right: 0px;
  background: #fff;
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.123);
  width:150px;
  > button {
    display: block;
    height: 20px;
    margin: 0px;
    border: 0px;
  }
}

.return-flag{
  position: absolute;
  top:-25px;
  font-weight: bold;
  font-size: 20px;
}

.menu-mask {
  z-index: 9998;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
}

.canteval-node {
  color: #f00;
}
</style>
