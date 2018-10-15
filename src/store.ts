import Vue from 'vue'
import Vuex from 'vuex'
import { ViewGraphNode } from '@/core/view-graph-node';
import { NodeType } from '@/core/node-interface';
import { NodeManager } from '@/core/node-manager';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nodeManager: new NodeManager(),
    connectorStartX: 0,
    connectorStartY: 0,
    connectorCursorX: 0,
    connectorCursorY: 0,
    isConnecting: false,
    connectFrom: null,
  },
  mutations: {
    addNode(state, node: ViewGraphNode) {
      state.nodeManager.currentNodeGraph.addNode(node);
    },
    removeNode(state, node: ViewGraphNode) {
      state.nodeManager.currentNodeGraph.removeNode(node);
    },
    defineGraphInput(state, payload) {
      const { node } = payload;
      state.nodeManager.mainNodeGraph.defineGraphParam(node);
    },
    cancleGraphInputDefine(state, node: ViewGraphNode) {
      state.nodeManager.mainNodeGraph.cancelGraphParamDefine(node);
    },
    defineGraphReturn(state, node: ViewGraphNode) {
      state.nodeManager.mainNodeGraph.defineReturnNode(node);
    },
    setNodeValue(state, payload) {
      payload.node.setValue(payload.value);
    },
    startConnection(state, payload) {
      state.isConnecting = true;
      state.connectFrom = payload.node;
      state.connectorStartX = payload.x;
      state.connectorStartY = payload.y;
      state.connectorCursorX = payload.x;
      state.connectorCursorY = payload.y;
    },
    connectingUpdate(state, payload) {
      state.connectorCursorX = payload.x;
      state.connectorCursorY = payload.y;
    },
    endConnection(state, payload) {
      state.isConnecting = false;
      state.connectFrom = null;
    },
  },
  actions: {

  }
})
