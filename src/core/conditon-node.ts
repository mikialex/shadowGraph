import { FunctionNode } from "@/core/function-node";
import { NodeInterface } from "@/core/node-interface";
import { NevaNode } from "@/core/node";

export class ConditionNode extends FunctionNode{
  constructor(nodeConfig: NodeInterface) {
    super(nodeConfig);
    
  }
}