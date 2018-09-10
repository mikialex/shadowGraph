import { NevaNode } from "./node";
import { NodeConfig, NodeGraphConfig, NodeGraphParamDescriptor, NodeType } from "./node-interface";
import { FunctionNode } from "@/core/function-node";

let globalNodeGraphId = 0;
export class NevaNodeGraph {
  constructor(config: NodeGraphConfig) {
    this.config = config;
    this.id = globalNodeGraphId;
    globalNodeGraphId++;
  }

  id: number;
  config: NodeGraphConfig;
  nodes: NevaNode[] = [];
  paramsMap: NodeGraphParamDescriptor[] = [];
  returnNode: NevaNode = null;

  checkIsInNodes(node) {
    return this.nodes.indexOf(node) !== -1;
  }

  checkGetGraphInputNodeName(node) {
    let name = '';
    this.paramsMap.forEach(outParam => {
      if (outParam.mapToNode.id === node.id) {
        name = outParam.name 
      }
    })
    return name;
  }

  addNode(node: NevaNode) {
    if (!this.checkIsInNodes(node)) {
      this.nodes.push(node);
      node.belongToGraph = this;
    }
  }

  removeNode(node: NevaNode) {
    let position = this.nodes.indexOf(node);
    if (position === -1) {
      console.warn('try to remove a node that not exist in nodegraph')
      return;
    }
    this.nodes.splice(position, 1);
    node.removeAllConnection();
  }

  cancelGraphParamDefine(node: NevaNode) {
    this.paramsMap = this.paramsMap.filter(param => {
      return param.mapToNode !== node;
    })
  }

  defineGraphParam(node: NevaNode, graphParamName: string) {
    // validation
    if (node.type !== NodeType.inputNode) {
      throw 'graphParm must defined on inputNode';
    }
    this.paramsMap.forEach(outParam => {
      if (outParam.mapToNode === node) {
        throw 'cant redefine same graphParam';
      }
      if (outParam.name === graphParamName) {
        throw 'cant define graphParam with same value';
      }
    })
    this.paramsMap.push({
      name: graphParamName,
      mapToNode: node
    })
  }

  defineReturnNode(node: NevaNode) {
    if (this.checkIsInNodes(node)) {
      this.returnNode = node;
    } else {
      throw 'cant define a node that not in nodes as return node'
    }
  }

  load(data: any) {
    
  }

  toJSON() {
    const nodesInfo = this.nodes.map(n => {
      return n.toJSON();
    })
    const paramsMapInfo = this.paramsMap.map(p => {
      return {
        nodeId: p.mapToNode.id,
        name: p.name,
      }
    })
    return {
      nodesInfo,
      paramsMapInfo,
      returnNode: this.returnNode ? this.returnNode.id : undefined,
    }
  }

}

export class NevaNodeFunctionGraph extends NevaNodeGraph {
  constructor(config: NodeGraphConfig) {
    super(config);
  }
  evalQueue: FunctionNode[];
  private shouldUpdateEvalDependency = false;

  get canEval() {
    return true;
  }

  public eval() {
    if (this.shouldUpdateEvalDependency) {
      this.updateEvalDependency()
    }
    this.evalQueue.forEach(node => {
      node.eval();
    })
    return this.returnNode.getValue();
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
      dirtyNodes = dirtyNodes.filter((n: FunctionNode) => {
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

}

