import { BaseNode } from "./node";
import { NodeManager } from "@/core/node-manager";

export class GraphNode extends BaseNode {
  public evaluFunction;
  public codeGenTemplate: string;

  constructor(nodeType: string, nodeManger: NodeManager) {
    super(nodeType, nodeManger);
    const nodeConfig = nodeManger.nodeConfigs[nodeType];
    this.evaluFunction = nodeConfig.evaluFunction;
    this.codeGenTemplate = nodeConfig.codeGen;

    this.inputParams = [];
    nodeConfig.paramsDescriptor.forEach(discriptor => {
      this.inputParams.push({
        name: discriptor.name,
        valueRef: null,
        validation: false,
        self: this,
      });
    });
  }

  public updateGraphValue() {
    const evalQueue: GraphNode[] = [];

    let dirtyNodes: GraphNode[] = [];
    function markDirty(node: GraphNode) {
      if (node.cashadowl && !node.isDirty) {
        dirtyNodes.push(node);
        node.isDirty = true;
        node.refedNodes.forEach(n => {
          markDirty(n as GraphNode);
        })
      }
    }
    markDirty(this);

    function checkCanUpdate(node: GraphNode) {
      let can = true;
      node.inputParams.forEach(n => {
        if (n.valueRef && n.valueRef.isDirty) {
          can = false;
        }
      })
      return can;
    }
    while (dirtyNodes.length !== 0) {
      dirtyNodes = dirtyNodes.filter((n: GraphNode) => {
        const checkSafeInputNode = n.isInputNode && !n.inputParams[0].valueRef;
        if (checkSafeInputNode || checkCanUpdate(n)) {
          n.isDirty = false;
          evalQueue.push(n);
          return false;
        } else {
          return true;
        }
      })
    }
    evalQueue.forEach(n => {
      n.eval();
    })
  }

  codeGen(): string {
    return this.manager.codeGenerator.codeGenGraphNode(this);
  }

  eval() {
    if (this.isInputNode) {
      const input = this.inputParams[0].valueRef;
      if (input) {
        this.value = input.getValue();
      }
    } else { // normal functional node
      const params: GraphNode[] = [];
      this.inputParams.forEach(input => {
        if (!input.valueRef) {
          throw 'cant eval on a not fulfilled node'
        }
        params.push(input.valueRef.getValue());
      })
      this.value = this.evaluFunction(params);
    }
  }
  
}
