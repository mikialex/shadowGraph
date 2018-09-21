import { BaseNode } from "./node";

export interface NodeParam { 
  name: string;
  valueRef: BaseNode | null;
  validation: boolean;
  self: BaseNode;
}

export function convertToStandardNodeParamDescriptor(param: NodeParamDescriptor): NodeParamDescriptor {
  if (param.required === undefined) param.required = true;

  return param;
}

export function convertToStandardNodeConfig(conf: NodeConfig): NodeConfig {
  conf.paramsDescriptor.forEach(param => {
    convertToStandardNodeParamDescriptor(param);
  })
  return conf;
}

export interface NodeParamDescriptor {
  name: string;
  required?: boolean;
  default?: any;
}

export enum NodeType{
  inputNode,
  graphProxy,
  GraphNode,
}

export interface NodeConfig {
  isInner: boolean;
  evaluFunction;
  isInputNode: boolean;
  paramsDescriptor: NodeParamDescriptor[];
  type: NodeType;
  name: string;
  codeGen: string;
  defaultValue?: any;
}

export interface NodeGraphParamDescriptor {
  name: string; // node graph parma name
  mapToNode: BaseNode;  // map to which node in graph
}

export interface NodeGraphConfig {
  name: string;

}