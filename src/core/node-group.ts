import { NevaNode } from "./node";

export interface NodeGroupParamDescriptor {
  name: string;
  mapToNode: NevaNode;
  mapToNodeParamName: string;
}

export class NevaNodeGroup{
  constructor() {
    
  }

  nodes: NevaNode[] = [];
  paramsMap: NodeGroupParamDescriptor[] = [];
  returnNode: NevaNode;

  checkIsInNodes(node) {
    return this.nodes.indexOf(node) !== -1;
  }

  addNode(node: NevaNode) {
    if (!this.checkIsInNodes(node)) {
      this.nodes.push(node); 
      node.belongToGroup = this;
    }
  }

  removeNode(node: NevaNode) {
    let position = this.nodes.indexOf(node);
    if (position === -1) {
      console.warn('try to remove a node that not exist in nodegroup')
      return;
    }
    this.nodes.splice(position, 1);
  }

  defineGroupParam(node: NevaNode, paramName: string, groupParamName: string) {
    // validation
    this.paramsMap.map(outParam => {
      if (outParam.mapToNode.id === node.id
        && outParam.mapToNodeParamName === paramName) {
        throw 'cant redefine same groupParam';
      }
      if (outParam.name === groupParamName) {
        throw 'cant define groupParam with same value';
      }
    })

    this.paramsMap.push({
      name: groupParamName,
      mapToNode: node,
      mapToNodeParamName: paramName,
    })
  }

  defineReturnNode(node: NevaNode) {
    if (this.checkIsInNodes(node)) {
      this.returnNode = node;
    } else {
      throw 'cant define a node that not in nodes as return node'
    }
  }

  toJSON() {
    const nodesInfo = this.nodes.map(n => {
      return n.toJSON();
    })
    const paramsMapInfo = this.paramsMap.map(p => {
      return {
        nodeId: p.mapToNode.id,
        paramName: p.mapToNodeParamName,
        name:p.name,
      }
    })
    return {
      nodesInfo, paramsMapInfo,
      returnNode:this.returnNode.id
    }
  }

}

export class NevaNodeFunctionGroup extends NevaNodeGroup {
  constructor() {
    super();
  }

  


}