
export interface NodeParams{
  name: string;
  value: any;
  validation: boolean;
}

export interface NodeParamsDescriptor {
  name: string;
  type: string;
}

export interface NodeInterface{
  evaluFunction;
  paramsDescriptor: NodeParamsDescriptor[];
}

const defaultValueMapper = {
  string: '',
  number: 0,
  boolean: false,
}

export class NevaNode{
  public name: string;
  public inputParams: NodeParams[];
  public output: any;
  public evaluFunction;
  public config: NodeInterface;
  constructor(nodeConfig: NodeInterface) {
    this.config = nodeConfig;
    this.evaluFunction = nodeConfig.evaluFunction;
    
    this.inputParams = [];
    nodeConfig.paramsDescriptor.forEach(discriptor => {
      this.inputParams.push({
        name: discriptor.name,
        value: defaultValueMapper[discriptor.type],
        validation: false
      });
    });

  }

  public evaluate() {
    this.output = this.evaluFunction(this.inputParams);
  }

  public validate() {
    
  }
}


// export class NodeAdd extends Node{
//   constructor() {

//   }
// }