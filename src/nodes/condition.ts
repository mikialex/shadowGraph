import { NodeType, NodeConfig } from "../core/node-interface";

export const ConditionNodeConfig: NodeConfig = {
  isBuiltIn: true,
  name: 'condition',
  type: NodeType.GraphNode,
  evaluFunction: (params: any[]) => {
    if (params[0]) {
      return params[1];
    } else {
      return params[2];
    }
  },
  isInputNode: false,
  paramsDescriptor: [
    {
      name: "prediction"
    },
    {
      name: "trueValue"
    },
    {
      name: "falseValue"
    },
  ],
  codeGen: ''
}