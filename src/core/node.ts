import { NodeParam, NodeConfig, NodeType } from "./node-interface";
import { NodeGraph } from "./node-graph";
import { generateUUID } from "../util/uuid";
import { NodeManager } from "@/core/node-manager";

export class BaseNode {
  public id: string;
  public name: string;
  public isDirty = false;
  public type: NodeType;
  public nodeDefineType: string;

  public inputParams: NodeParam[] = [];
  public refedNodes: BaseNode[] = [];

  protected value: any = null;

  public belongToGraph: NodeGraph;
  public manager: NodeManager;

  get config(): NodeConfig {
    return this.manager.nodeConfigs[this.nodeDefineType];
  }

  constructor(nodeDefineType: string, nodeManger: NodeManager) {
    this.manager = nodeManger;
    const nodeConfig = nodeManger.nodeConfigs[nodeDefineType];
    if (nodeConfig === undefined) {
      throw `cant create node ${nodeDefineType}`;
    }
    this.type = nodeConfig.type;
    this.nodeDefineType = nodeDefineType;
    this.name = nodeConfig.name;
    this.id = generateUUID();
    if (nodeConfig.defaultValue !== undefined) {
      this.value = nodeConfig.defaultValue;
    }
  }

  get isReturnNode() {
    return this.belongToGraph.returnNode === this;
  }

  get isInputNode() {
    return this.type === NodeType.inputNode;
  }

  get isGraphInput() {
    return this.belongToGraph.checkGetGraphInputNodeName(this)!=='';
  }

  get graphInputName() {
    return this.belongToGraph.checkGetGraphInputNodeName(this);
  }

  get isProxyGraphNode() {
    return this.type === NodeType.graphProxy;
  }

  get cashadowl() {
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

  codeGen(ctx?): any {
    throw 'not implement';
  }

  public getValue() {
    return this.value;
  }

  public setValue(val) {
    this.value = val;
  }

  public checkIfCashadowluate() {
    throw 'checkIfCashadowluate not imple'
  }

  public pipeFrom(node: BaseNode, injectSlot: string) {
    this.inputParams.forEach(input => {
      if (input.name === injectSlot) {
        input.valueRef = node;
        if (!node.refedNodes.includes(this)) {
          node.refedNodes.push(this);
        }
      }
    })
  }

  private removeRefedNode(node: BaseNode) {
    this.refedNodes.filter(n => {
      n.id !== node.id;
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

  public toJSON(): any {
    return {
      id: this.id,
      type: this.config.name,
      InputValue: this.isInputNode ? this.value : undefined, 
      refNodes: this.inputParams.map(param => {
        return param.valueRef?param.valueRef.id:null
      })
    }
  }
}
