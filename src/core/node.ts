import { NodeParamsDescriptor, NodeParams, NodeInterface } from "@/core/node-interface";


// const defaultValueMapper = {
//   string: '',
//   number: 0,
//   boolean: false,
// }

let globalNodeId = 0;

export class NevaNode{
  public id: number;
  public type = 'default type';
  public inputParams: NodeParams[];
  public refedNodes: NevaNode[] = [];
  protected value: any = null;
  private config: NodeInterface;
  public isInputNode: boolean;

  public getValue() {
    return this.value;
  }

  public setValue(val) {
    this.value = val;
  }

  public checkIfCanEvaluate() {
    throw 'checkIfCanEvaluate not imple'
  }

  constructor(nodeConfig: NodeInterface) {
    this.config = nodeConfig;
    this.isInputNode = nodeConfig.isInputNode;
    this.type = nodeConfig.type;
    this.id = globalNodeId;
    globalNodeId++;
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


  public evaluate() {
    const evalStack = [];
    evalStack.push(this);
    function collectDependency(node: NevaNode) {
      for (let i = 0; i < node.inputParams.length; i++) {
        const input = node.inputParams[i];
        const ref = input.valueRef;
        if (ref) {
          if (evalStack.indexOf(ref) === -1) {
            evalStack.push(ref);
            collectDependency(ref);
          }
        }
      }
    }
    collectDependency(this);
    console.log(evalStack);

    evalStack.reverse().forEach((node: FunctionNode) => {
      if (node.checkIfCanEvaluate()) {
        const params = [];
        node.inputParams.forEach(input => {
          params.push(input.valueRef.getValue());
        })
        if (!node.isInputNode) {
          node.value = node.evaluFunction(params);
        }
      } else {
        throw `node: ${node.id} 's params not ready`
      }
    })
    console.log('node eval: ', this.getValue());
    
  }

  public checkIfCanEvaluate() {
    let isvalid = true;
    this.inputParams.forEach(input => {
      if (!input.valueRef) {
        isvalid = false;
      }
    })
    return isvalid;
  }


  public pipeFrom(node:NevaNode, injectSlot:string) {
    this.inputParams.forEach(input => {
      if (input.name === injectSlot) {
        input.valueRef = node;
        node.refedNodes.push(this);
      }
    })
  }

}
