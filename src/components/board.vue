<template>
  <div>
    <div class="tool-bar">
      <GraphNodeListCom/>
      <div>
        <span>add node:</span>
        <div
        v-for="config in nodeTypeList" :key="config.name"
         @click="switchCurrentType(config)"
        class="new-node"
        :class="{'current-type':config === currentType}"
        >
          {{config.name}}
        </div>

        <button v-if="currentType !== null"
        @click="switchCurrentType(null)"
        >cancel</button>

      </div>
    </div>

    <div class="board-wrap">
      <div class="move-mask" 
      v-if="isViewChanging"
      @mousedown="startMove"
      ></div>
      <NodeConnector></NodeConnector>
      <div class="shadow-board" 
      id="board" 
      @mousedown.self="addNode"
      :style="{cursor:this.$store.state.isConnecting?'crosshair': ''}"
      >
        <BaseNodeCom v-for="node in GraphNodeList" 
        :node="node"
        :boardInfo="boardInfo"
        :key="node.id"></BaseNodeCom>

        <BaseNodeNumberInputCom v-for="node in numberInputList" 
        :node="node"
        :boardInfo="boardInfo"
        :key="node.id"></BaseNodeNumberInputCom>

        <BaseNodeBooleanInputCom v-for="node in booleanInputList" 
        :node="node"
        :boardInfo="boardInfo"
        :key="node.id"></BaseNodeBooleanInputCom>

      </div>
    </div>


  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import BaseNodeCom from "@/components/node.vue";
import BaseNodeNumberInputCom from "@/components/node/input/number-input-node.vue";
import BaseNodeBooleanInputCom from "@/components/node/input/boolean-input-node.vue";
import GraphNodeListCom from "@/components/graph-node-list.vue";
import { ViewGraphNode } from "../core/view-graph-node";
import { NodeType } from "../core/node-interface";
import NodeConnector from "@/components/connector.vue";

@Component({
  components: {
    BaseNodeCom,
    BaseNodeNumberInputCom,
    BaseNodeBooleanInputCom,
    NodeConnector,
    GraphNodeListCom
  }
})
export default class shadowBoard extends Vue {
  currentType = null;
  switchCurrentType(newType) {
    this.currentType = newType;
  }

  get nodeTypeList() {
    return Object.keys(this.manager.nodeConfigs).map(
      key => this.manager.nodeConfigs[key]
    );
  }

  mounted(){
    this.updateBoardInfo();
  }

  boardInfo = {
    offsetX: 0,
    offsetY: 0,
  }

  viewOffsetX = 0;
  viewOffsetY = 0;
  viewScale = 1;
  isViewChanging = false;
  originX = 0;
  originY = 0;
  startX = 0;
  startY = 0;
  updateView(e){
    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;
    this.viewOffsetX = this.originX + deltaX;
    this.viewOffsetY = this.originY + deltaY;
  }
  stopMove(e){
    window.removeEventListener('mousemove',this.updateView);
    window.removeEventListener('mouseup', this.stopMove);
  }
  startMove(e){
    this.originX = this.viewOffsetX;
    this.originY = this.viewOffsetY;
    this.startX = e.clientX;
    this.startY = e.clientY;
    window.addEventListener('mousemove',this.updateView);
    window.addEventListener('mouseup', this.stopMove);
  }

  updateBoardInfo(){
    const board = document.querySelector("#board");
    if(!board){
      this.boardInfo = {
        offsetX: 0,
        offsetY: 0,
      }
      return;
    } 
    const bounding = board.getBoundingClientRect();
    this.boardInfo =  {
      offsetX: bounding.left,
      offsetY: bounding.top
    };
  }

  get inputList() {
    return this.manager.currentNodeGraph.nodes.filter(n => {
      return n.type === NodeType.inputNode;
    });
  }

  get numberInputList() {
    return this.inputList.filter(n => {
      return n.name === "number-input";
    });
  }

  get booleanInputList() {
    return this.inputList.filter(n => {
      return n.name === "boolean-input";
    });
  }

  get manager() {
    return this.$store.state.nodeManager;
  }

  get GraphNodeList() {
    return this.$store.state.nodeManager.currentNodeGraph.nodes.filter(n => {
      return n.type !== NodeType.inputNode;
    });
  }

  addNode(e: MouseEvent) {
    if (this.currentType) {
      let newNode = new ViewGraphNode(this.currentType.name, this.manager);
      newNode.positionX = e.clientX;
      newNode.positionY = e.clientY;
      this.$store.commit("addNode", newNode);
    }
    this.switchCurrentType(null);
  }
}
</script>

<style scoped lang="scss">

.board-wrap{
  width: 600px;
  height: 400px;
  overflow: hidden;
  border: 1px solid #888;
  margin: 5px;
}

.shadow-board {
  width: 100%;
  height: 100%;
  position: relative;
}

.move-mask{
  width: 100%;
  height: 100%;
  position:absolute;
  z-index: 999;
}

.new-node {
  font-size: 12px;
  display: inline-block;
  border: 1px solid #eee;
  padding: 3px;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
  &:active {
    background: #ddd;
  }
}

.tool-bar {
  display: flex;
}

.current-type {
  background: #88f;
}
</style>
