import { NodeType } from "../core/node-interface";

export const InputNodeConfig = {
  name: 'input',
  type: NodeType.inputNode,
  defaultValue: 0,
  evaluFunction: undefined,
  paramsDescriptor: [
    {
      name: "dataport"
    },
  ],
  codeGen:'{{p1}}'
}