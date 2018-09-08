import { NodeType, NodeConfig } from "@/core/node-interface";

export const ReceiverNodeConfig: NodeConfig = {
  isInner: true,
  name: 'input',
  type: NodeType.inputNode,
  isInputNode: true,
  defaultValue: 0,
  evaluFunction: undefined,
  paramsDescriptor: [
    {
      name: "receiver"
    },
  ],
  codeGen: '{{p1}}'
}