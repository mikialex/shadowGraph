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

export interface NodeInterface {
  evaluFunction;
  paramsDescriptor: NodeParamDescriptor[];
  isInputNode?: boolean;
  type: string;
}
