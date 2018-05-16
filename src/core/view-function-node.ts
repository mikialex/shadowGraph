import { FunctionNode } from "@/core/node";
import { NodeInterface } from "@/core/node-interface";

export class ViewFunctionNode extends FunctionNode{
  constructor(nodeConfig: NodeInterface) {
    super(nodeConfig)
  }

  public positionX = 0;
  public positionY = 0;

  public connectReceiverX = 0;
  public connectReceiverY = 10;

  public connectEmitorX = 100;
  public connectEmitorY = 10;
  

}