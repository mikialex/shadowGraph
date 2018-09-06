import { NodeType, NodeConfig } from "../core/node-interface";

export const AdditionNodeConfig: NodeConfig = {
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
  ],
  codeGen: '({{p1}} + {{p2}})'
}