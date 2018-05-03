
export interface NodeParams{
  name: string;
  valueRef: NevaNode;
  validation: boolean;
}

export interface NodeParamsDescriptor {
  name: string;
}

export interface NodeInterface{
  evaluFunction;
  paramsDescriptor: NodeParamsDescriptor[];
}

// const defaultValueMapper = {
//   string: '',
//   number: 0,
//   boolean: false,
// }

export class NevaNode{
  public name: string;
  public inputParams: NodeParams[];
  protected output: any;
  public config: NodeInterface;

  public getOutput() {
    return this.output;
  }

  public checkIfCanEvaluate() {
    throw 'checkIfCanEvaluate not imple'
  }

  constructor(nodeConfig: NodeInterface) {
    this.config = nodeConfig;
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
        validation: false
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

    evalStack.reverse().forEach((node: NevaNode) => {
      if (node.checkIfCanEvaluate()) {
        const params = [];
        this.inputParams.forEach(input => {
          params.push(input.valueRef.getOutput());
        })
        this.output = this.evaluFunction(params);
      } else {
        throw 'params not ready'
      }
    })
    console.log('node eval: ', this.getOutput());
    
  }

  public checkIfCanEvaluate() {
    return true;
  }


  public pipeTo(node:NevaNode, injectSlot:string) {
    node.inputParams.forEach(input => {
      if (input.name === injectSlot) {
        input.valueRef = this;
      }
    })
  }

}
