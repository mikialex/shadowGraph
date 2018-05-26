import { NevaNodeFunctionGroup } from "./node-group";
import { NevaNode } from "./node";
import { NodeManager } from "./node-manager";

interface NodeValueCache{
  node: NevaNode;
  value: any;
}

export class EvalFrame {
  constructor(nodeGroup: NevaNodeFunctionGroup) {

  }
  currentEvalPoint: NevaNode
  valueList: NodeValueCache[] = [];
}


export class NevaNodeEvalMachine{
  constructor(manager: NodeManager) {
    this.nodeManager = manager;
  }

  eval() {
    
  }

  nodeManager: NodeManager;
  evalStack: EvalFrame[];
  currentFrame: EvalFrame;

  private clearEvalStates() {

  }

  private createNewEvalFrame(nodeGroup: NevaNodeFunctionGroup) {
    return new EvalFrame(nodeGroup);
  }


}