import { FunctionNode } from "@/core/function-node";
import { NodeConfig } from "@/core/node-interface";
import { NevaNode } from "@/core/node";

export class ConditionNode extends FunctionNode{
  constructor(nodeConfig: NodeConfig) {
    super(nodeConfig);
    
  }
}