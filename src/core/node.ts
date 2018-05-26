import { NodeParamDescriptor, NodeParam, NodeInterface } from "./node-interface";
import { NevaNodeGroup } from "./node-group";


let globalNodeId = 0;

export class NevaNode{
  public id: number;
  public isDirty = false;
  public type = 'default type';
  public inputParams: NodeParam[];
  public refedNodes: NevaNode[] = [];
  protected value: any = null;
  private config: NodeInterface;
  public isInputNode: boolean;
  public belongToGroup: NevaNodeGroup;

  constructor(nodeConfig: NodeInterface) {
    this.config = nodeConfig;
    this.isInputNode = nodeConfig.isInputNode;
    this.type = nodeConfig.type;
    this.id = globalNodeId;
    globalNodeId++;
  }

  get canEval() {
    if (this.isInputNode) {
      return true;
    }
    let isvalid = true;
    this.inputParams.forEach(input => {
      if (!input.valueRef) {
        isvalid = false;
      }
    })
    return isvalid;
  }


  public getValue() {
    return this.value;
  }

  public setValue(val) {
    this.value = val;
  }

  public checkIfCanEvaluate() {
    throw 'checkIfCanEvaluate not imple'
  }

  public pipeFrom(node: NevaNode, injectSlot: string) {
    this.inputParams.forEach(input => {
      if (input.name === injectSlot) {
        input.valueRef = node;
        node.refedNodes.push(this);
      }
    })
  }

  private removeRefedNode(node: NevaNode) {
    this.refedNodes.filter(n => {
      n.id === node.id;
    })
  }
  public removeDependencyByNodeParam(inputPara: NodeParam) {
    this.inputParams.forEach(input => {
      if (inputPara.name === input.name && input.valueRef) {
        input.valueRef.removeRefedNode(this);
        input.valueRef = null;
      }
    })
  }
  public removeAllPiped() {
    this.refedNodes.forEach(refn => {
      refn.inputParams.forEach(ref => {
        if (ref.valueRef && this.id === ref.valueRef.id) {
          ref.valueRef = null;
        }
      })
    });
  }
  public removeAllRefed() {
    this.inputParams.forEach(input => {
      if (input.valueRef) {
        input.valueRef.removeRefedNode(this);
        input.valueRef = null;
      }
    })
  }
  public removeAllConnection() {
    this.removeAllPiped();
    this.removeAllRefed();
  }

  public toJSON() {
    return {
      
    }
  }
}
