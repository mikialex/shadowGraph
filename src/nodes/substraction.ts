import { NodeType, NodeConfig } from "../core/node-interface";

export const SubstractionNodeConfig: NodeConfig = {
  isBuiltIn: true,
  type: NodeType.GraphNode,
  name: 'substraction',
  evaluFunction: (params: any[]) => {
    return params[0] - params[1];
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
  codeGen: '({{p1}} - {{p2}})'
}