import { NevaNode } from "@/core/node";

export interface NodeParams {
  name: string;
  valueRef: NevaNode;
  validation: boolean;
}

export interface NodeParamsDescriptor {
  name: string;
}

export interface NodeInterface {
  evaluFunction;
  paramsDescriptor: NodeParamsDescriptor[];
  isInputNode?: boolean;
  type: string;
}
