import Vue from 'vue'
import Vuex from 'vuex'
import { ViewFunctionNode } from '@/core/view-function-node';
import { NodeType } from '@/core/node-interface';
import { NodeManager } from '@/core/node-manager';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nodeManager: new NodeManager(),
    nodeList: [],
    connectorStartX: 0,
    connectorStartY: 0,
    connectorCursorX: 0,
    connectorCursorY: 0,
    isConnecting: false,
    connectFrom: null,
    lines:[],
  },
  mutations: {
    addNode(state, node: ViewFunctionNode) {
       // todo check duplicate
      state.nodeList.push(node);
    },
    removeNode(state, node: ViewFunctionNode) {
      state.nodeList = state.nodeList.filter(n => {
        return n.id !== node.id;
      })
      node.removeAllConnection();
    },
    setNodeValue(state, payload) {
      const n = state.nodeList.filter(n => {
        return n.id === payload.node.id;
      })
      n[0].setValue(payload.value);
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
