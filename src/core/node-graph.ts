import { NevaNode } from "./node";
import { NodeConfig, NodeGraphConfig, NodeGraphParamDescriptor, NodeType } from "./node-interface";
import { FunctionNode } from "@/core/function-node";
import { generateUUID } from "@/util/uuid";
import { ViewFunctionNode } from "@/core/view-function-node";
import { NodeManager } from "@/core/node-manager";

export class NevaNodeGraph {
  constructor(config: NodeGraphConfig, manager: NodeManager) {
    this.config = config;
    this.id = generateUUID();
    this.manager = manager;
  }

  name: string = 'default-graph';
  id: string;
  config: NodeGraphConfig;
  nodes: NevaNode[] = [];
  paramsMap: NodeGraphParamDescriptor[] = [];
  returnNode: NevaNode = null;
  manager: NodeManager;

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

  clear() {
    this.nodes = [];
    this.returnNode = null;
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

  codeGen() {
    if (this.returnNode === null) {
      throw 'you should define return node to gen a graphs code'
    }
    let functionBody = this.returnNode.codeGen();
    let functionString = 
    `function(){
        ${functionBody}
      }`;
    return functionString;
  }

  loadData(data: any) {
    const nodeMap = {};
    data.nodesInfo.forEach(info => {
      const newNode = new ViewFunctionNode(info.type, this.manager);
      newNode.id = info.id;
      newNode.positionX = info.viewData.positionX;
      newNode.positionY = info.viewData.positionY;
      nodeMap[info.id] = newNode;
    })
    const nodeList = [];
    data.nodesInfo.forEach(info => {
      const newNode: ViewFunctionNode = nodeMap[info.id];
      info.refNodes.forEach((rinfo, index) => {
        const inputNode = nodeMap[rinfo];
        if (inputNode) {
          const slot = newNode.inputParams[index].name;
          newNode.pipeFrom(inputNode, slot);
        }
      })
      nodeList.push(newNode);
    });

    nodeList.forEach(node => {
      this.addNode(node);
    })
    
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
  constructor(config: NodeGraphConfig, manager: NodeManager) {
    super(config, manager);
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

