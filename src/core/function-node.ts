import { NevaNode } from "./node";
import { NodeConfig } from "./node-interface";
import { NodeManager } from "@/core/node-manager";

export class FunctionNode extends NevaNode {
  public evaluFunction;
  public codeGenTemplate:string;

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
    const evalQueue = [];

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
    markDirty(this);

    function checkCanUpdate(node: NevaNode) {
      let can = true;
      node.inputParams.forEach(n => {
        if (n.valueRef.isDirty) {
          can = false;
        }
      })
      return can;
    }
    while (dirtyNodes.length !== 0) {
      dirtyNodes = dirtyNodes.filter((n: NevaNode) => {
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
    return this.manager.codeGenerator.codeGenFunctionNode(this);
  }

  eval() {
    if (this.isInputNode) {
      if (this.inputParams[0].valueRef) {
        this.value = this.inputParams[0].valueRef.getValue();
      }
    } else { // normal functional node
      const params = [];
      this.inputParams.forEach(input => {
        params.push(input.valueRef.getValue());
      })
      this.value = this.evaluFunction(params);
    }
  }
  
}
