
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
    if (this.checkIfCanEvaluate()) {
      const params = [];
      this.inputParams.forEach(input => {
        params.push(input.valueRef.getOutput());
      })
      this.output = this.evaluFunction(params);
    } else {
      throw 'params not ready'
    }
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
