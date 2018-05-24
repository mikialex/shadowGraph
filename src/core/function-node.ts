import { NevaNode } from "@/core/node";
import { NodeInterface } from "@/core/node-interface";

export class FunctionNode extends NevaNode {
  public evaluFunction;

  constructor(nodeConfig: NodeInterface) {
    super(nodeConfig);
    this.evaluFunction = nodeConfig.evaluFunction;

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
      if (!n.isInputNode) {
        const params = [];
        n.inputParams.forEach(input => {
          params.push(input.valueRef.getValue());
        })
        n.value = n.evaluFunction(params);
      } else {
        if (n.inputParams[0].valueRef) {
          n.value = n.inputParams[0].valueRef.value;
        }
      }
    })

  }

}
