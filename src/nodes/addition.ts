import { NodeType } from "../core/node-interface";

export const AdditionNodeConfig = {
  type: NodeType.functionNode,
  name: 'addition',
  evaluFunction: (params: any[]) => {
    return params[0] + params[1];
  },
  isInputNode: false,
  paramsDescriptor: [
    {
      name: "number1"
    },
    {
      name: "number2"
    }
  ]
}