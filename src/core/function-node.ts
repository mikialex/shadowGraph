import { NevaNode } from "./node";
import { NodeConfig } from "./node-interface";

export class FunctionNode extends NevaNode {
  public evaluFunction;
  public codeGenTemplate:string;

  constructor(nodeConfig: NodeConfig) {
    super(nodeConfig);
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
    let str = this.codeGenTemplate;
    if (this.isInputNode) {
      str = str.replace(`{{p1}}`, this.value.toString());
    } else {
      this.inputParams.forEach((input, index) => {
        if (this.isInputNode) {
          str = str.replace(`{{p${index + 1}}}`, this.value);
        } else {
          str = str.replace(`{{p${index + 1}}}`, input.valueRef.codeGen());
        }
      })
    }
    return str;
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
