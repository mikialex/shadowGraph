import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nodeList: [],
    inputNodeList:[],
  },
  mutations: {
    addNode(state, node) {
       // todo check duplicate
      if (node.type === 'input') {
        state.inputNodeList.push(node);
      } else {
        state.nodeList.push(node);
      }
    },
    removeNode(state, node) {
      if (node.type === 'input') {
        state.inputNodeList = state.inputNodeList.filter(n => {
          return n.id !== node.id;
        })
      } else {
        state.nodeList = state.nodeList.filter(n => {
          return n.id !== node.id;
        })
      }
    },
  },
  actions: {

  }
})
