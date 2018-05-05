import { FunctionNode } from "@/core/node";
import { NodeInterface } from "@/core/node-interface";

export class ViewFunctionNode extends FunctionNode{
  constructor(nodeConfig: NodeInterface) {
    super(nodeConfig)
  }

  public positionX = 0;
  public positionY = 0;

  

}