import { NodeType, NodeConfig } from "@/core/node-interface";

export const NumberInputNodeConfig: NodeConfig = {
  isInner: true,
  name: 'number-input',
  type: NodeType.inputNode,
  isInputNode: true,
  defaultValue: 0,
  evaluFunction: undefined,
  paramsDescriptor: [
    {
      name: "dataport"
    },
  ],
  codeGen:'{{p1}}'
}