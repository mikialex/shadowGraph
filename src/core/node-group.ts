import { NevaNode } from "./node";
import { NodeConfig, NodeGroupConfig, NodeGroupParamDescriptor } from "./node-interface";


export class NevaNodeGroup{
  constructor(config: NodeGroupConfig) {
    this.config = config;
    this.name = config.name;
  }

  name: string;
  config: NodeGroupConfig;
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

export class EvalFrame{
  constructor(nodeGroup: NevaNodeFunctionGroup) {
    
  }
}

export class NevaNodeFunctionGroup extends NevaNodeGroup {
  constructor(config: NodeGroupConfig) {
    super(config);
  }
  evalStack: EvalFrame[];
  evalQueue: NevaNode[];
  get canEval() {
    return true;
  }

  private clearEvalStates() {
    
  }

  private createEvalFrame() {
    this.evalStack.push(new EvalFrame(this));
    this.clearEvalStates();
  }


  private updateEvalDependency() {
    this.evalQueue = [];

    // get input Nodes
    const paramNodes = [];
    this.paramsMap.forEach(m => {
      let found = false;
      paramNodes.forEach(n => {
        if (m.mapToNode.id === n.id) {
          found = true;
        }
      })
      if (found === false) {
        paramNodes.push(m.mapToNode)
      }
    })

    this.evalQueue = this.evalQueue.concat(paramNodes);

    let dirtyNodes = [];
    function markDirty(node: NevaNode) {
      if (node.canEval && !node.isDirty) {
        dirtyNodes.push(node);
        node.isDirty = true;
        node.refedNodes.forEach(n => {
          markDirty(n);
        })
      }
    }
    paramNodes.forEach(n => { markDirty(n) });

    function checkCanUpdate(node: NevaNode) {
      let can = true;
      node.inputParams.forEach(n => {
        if (n.valueRef.isDirty) {
          can = false;
        }
      })
      return can;
    }

    // TODO need test list optimize here
    while (dirtyNodes.length !== 0) {
      dirtyNodes = dirtyNodes.filter((n: NevaNode) => {
        const checkSafeInputNode = n.isInputNode && !n.inputParams[0].valueRef;
        if (checkSafeInputNode || checkCanUpdate(n)) {
          n.isDirty = false;
          this.evalQueue.push(n);
          return false;
        } else {
          return true;
        }
      })
    }
  }


  eval() {
    
  }


}


export class NodeGroupManager {
  constructor() {

  }

  nodeGroupList: NevaNodeGroup[];
  mainNodeGroup: NevaNodeGroup;

  nodeConfigList: NodeConfig[];

  registerNodeConfig(conf: NodeConfig) {
    this.nodeConfigList.push(conf);
  }
}