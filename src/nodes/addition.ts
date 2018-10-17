import { NodeType, NodeConfig } from "../core/node-interface";
import { builtInType } from '@/core/type/builtin/builtin';

export const AdditionNodeConfig: NodeConfig = {
  isBuiltIn: true,
  type: NodeType.GraphNode,
  name: 'addition',
  // returnType: 
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