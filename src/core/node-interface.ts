import { NevaNode } from "@/core/node";

export interface NodeParam {
  name: string;
  valueRef: NevaNode;
  validation: boolean;
  self: NevaNode;
}

export interface NodeParamDescriptor {
  name: string;
}

export interface NodeConfig {
  evaluFunction;
  paramsDescriptor: NodeParamDescriptor[];
  isInputNode?: boolean;
  type: string;
}
