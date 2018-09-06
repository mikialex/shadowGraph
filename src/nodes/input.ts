import { NodeType, NodeConfig } from "../core/node-interface";

export const InputNodeConfig: NodeConfig = {
  name: 'input',
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