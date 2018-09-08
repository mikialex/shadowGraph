import { NodeType, NodeConfig } from "@/core/node-interface";

export const BooleanInputNodeConfig: NodeConfig = {
  isInner: true,
  name: 'boolean-input',
  type: NodeType.inputNode,
  isInputNode: true,
  defaultValue: true,
  evaluFunction: undefined,
  paramsDescriptor: [
    {
      name: "dataport"
    },
  ],
  codeGen: '{{p1}}'
}