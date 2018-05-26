import { NevaNode } from "./node";
import { NodeConfig } from "./node-interface";

export class FunctionGroupNode extends NevaNode{
  constructor(nodeConfig: NodeConfig) {
    super(nodeConfig);
    // this.evaluFunction = nodeConfig.evaluFunction;

    // this.inputParams = [];
    // nodeConfig.paramsDescriptor.forEach(discriptor => {
    //   this.inputParams.push({
    //     name: discriptor.name,
    //     valueRef: null,
    //     validation: false,
    //     self: this,
    //   });
    // });
  }
}