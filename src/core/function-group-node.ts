import { NevaNode } from "./node";
import { NodeConfig } from "./node-interface";
import { NodeManager } from "@/core/node-manager";

export class FunctionGraphNode extends NevaNode{
  constructor(nodeType: string, nodeManger: NodeManager) {
    super(nodeType, nodeManger);
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

  eval() {
    
  }

}