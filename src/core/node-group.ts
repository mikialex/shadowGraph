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

  checkIsDuplicate(node) {
    return this.nodes.indexOf(node) !== -1;
  }

  addNode(node: NevaNode) {
    if (!this.checkIsDuplicate(node)) {
      this.nodes.push(node); 
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

  toJSON() {
    
  }

}

export class NevaNodeFunctionGroup extends NevaNodeGroup {
  constructor() {
    super();
  }

  


}