import { NodeParamDescriptor, NodeParam, NodeInterface } from "@/core/node-interface";


// const defaultValueMapper = {
//   string: '',
//   number: 0,
//   boolean: false,
// }

let globalNodeId = 0;

export class NevaNode{
  public id: number;
  public isDirty = false;
  public type = 'default type';
  public inputParams: NodeParam[];
  public refedNodes: NevaNode[] = [];
  protected value: any = null;
  private config: NodeInterface;
  public isInputNode: boolean;

  constructor(nodeConfig: NodeInterface) {
    this.config = nodeConfig;
    this.isInputNode = nodeConfig.isInputNode;
    this.type = nodeConfig.type;
    this.id = globalNodeId;
    globalNodeId++;
  }

  get canEval() {
    if (this.isInputNode) {
      return true;
    }
    let isvalid = true;
    this.inputParams.forEach(input => {
      if (!input.valueRef) {
        isvalid = false;
      }
    })
    return isvalid;
  }


  public getValue() {
    return this.value;
  }

  public setValue(val) {
    this.value = val;
  }

  public checkIfCanEvaluate() {
    throw 'checkIfCanEvaluate not imple'
  }

  public pipeFrom(node: NevaNode, injectSlot: string) {
    this.inputParams.forEach(input => {
      if (input.name === injectSlot) {
        input.valueRef = node;
        node.refedNodes.push(this);
      }
    })
  }

  private removeRefedNode(node: NevaNode) {
    this.refedNodes.filter(n => {
      n.id === node.id;
    })
  }
  public removeDependencyByNodeParam(inputPara: NodeParam) {
    this.inputParams.forEach(input => {
      if (inputPara.name === input.name && input.valueRef) {
        input.valueRef.removeRefedNode(this);
        input.valueRef = null;
      }
    })
  }
  public removeAllPiped() {
    this.refedNodes.forEach(refn => {
      refn.inputParams.forEach(ref => {
        if (ref.valueRef && this.id === ref.valueRef.id) {
          ref.valueRef = null;
        }
      })
    });
  }
  public removeAllRefed() {
    this.inputParams.forEach(input => {
      if (input.valueRef) {
        input.valueRef.removeRefedNode(this);
        input.valueRef = null;
      }
    })
  }
  public removeAllConnection() {
    this.removeAllPiped();
    this.removeAllRefed();
  }
}

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
        self:this,
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
      dirtyNodes = dirtyNodes.filter(n => {
        if (checkCanUpdate(n)) {
          evalQueue.push(n);
          return true;
        } else {
          return false;
        }
      })
    }
    evalQueue.forEach(n => {
      const params = [];
      n.inputParams.forEach(input => {
        params.push(input.valueRef.getValue());
      })
      if (!n.isInputNode) {
        n.value = n.evaluFunction(params);
      }
    })

  }

}
