import Vue from 'vue'
import Vuex from 'vuex'
import { ViewFunctionNode } from '@/core/view-function-node';
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
    addNode(state, node: ViewFunctionNode) {
      state.nodeManager.currentNodeGraph.addNode(node);
    },
    removeNode(state, node: ViewFunctionNode) {
      state.nodeManager.currentNodeGraph.removeNode(node);
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
