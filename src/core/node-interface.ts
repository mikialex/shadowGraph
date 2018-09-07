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
  graphProxy,
  functionNode,
}

export interface NodeConfig {
  isInner: boolean;
  evaluFunction;
  isInputNode: boolean;
  paramsDescriptor: NodeParamDescriptor[];
  type: NodeType;
  name: string;
  codeGen: string;
  defaultValue?: number;
}

export interface NodeGraphParamDescriptor {
  name: string;
  mapToNode: NevaNode;
  mapToNodeParamName: string;
}

export interface NodeGraphConfig {
}