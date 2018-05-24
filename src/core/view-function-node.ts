import { FunctionNode } from "@/core/function-node";
import { NodeInterface } from "@/core/node-interface";

export class ViewFunctionNode extends FunctionNode{
  constructor(nodeConfig: NodeInterface) {
    super(nodeConfig);
    nodeConfig.paramsDescriptor.forEach((discriptor, index) => {
      this.inputsPositions.push({
        name: discriptor.name,
        reciverX: 0,
        reciverY:index * 15 + 45,
      });
    });
  }

  public inputsPositions = [];

  public positionX = 0;
  public positionY = 0;

  public connectReceiverX = 0;
  public connectReceiverY = 10;

  public connectEmitorX = 100;
  public connectEmitorY = 30;
  

}