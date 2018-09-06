import { NevaNode } from "./node";

export interface NodeParam { 
  name: string;
  valueRef: NevaNode;
  validation: boolean;
  self: NevaNode;
}

export interface NodeParamDescriptor {
  name: string;
}

export enum NodeType{
  inputNode,
  groupProxy,
  functionNode,
}

export interface NodeConfig {
  evaluFunction;
  isInputNode: boolean;
  paramsDescriptor: NodeParamDescriptor[];
  type: NodeType;
  name: string;
  codeGen: string;
  defaultValue?: number;
}

export interface NodeGroupParamDescriptor {
  name: string;
  mapToNode: NevaNode;
  mapToNodeParamName: string;
}

export interface NodeGroupConfig {
}