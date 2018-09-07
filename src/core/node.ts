import { NodeParamDescriptor, NodeParam, NodeConfig, NodeType } from "./node-interface";
import { NevaNodeGroup } from "./node-group";
import { generateUUID } from "../util/uuid";
import { NodeManager } from "@/core/node-manager";

export class NevaNode{
  public id: string;
  public name: string;
  public isDirty = false;
  public type: NodeType;
  public inputParams: NodeParam[];
  public refedNodes: NevaNode[] = [];
  public preNode: NevaNode;
  protected value: any = null;
  public belongToGroup: NevaNodeGroup;
  public manager: NodeManager;
  public nodeType: string;

  get config(): NodeConfig {
    return this.manager.nodeConfigs[this.nodeType];
  }

  constructor(nodeType: string, nodeManger: NodeManager) {
    this.manager = nodeManger;
    const nodeConfig = nodeManger.nodeConfigs[nodeType];
    if (nodeConfig === undefined) {
      throw `cant create node ${nodeType}`;
    }
    this.type = nodeConfig.type;
    this.name = nodeConfig.name;
    this.id = generateUUID();
    if (nodeConfig.defaultValue !== undefined) {
      this.value = nodeConfig.defaultValue;
    }
  }

  get isInputNode() {
    return this.type === NodeType.inputNode;
  }

  get isProxyGroupNode() {
    return this.type === NodeType.groupProxy;
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

  codeGen(): string {
    throw 'not implement';
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
      id: this.id,
      type: this.config.name,
      InputValue: this.isInputNode ? this.value : undefined, 
      refNodes: this.inputParams.map(param => {
        return param.valueRef.id
      })
    }
  }
}
