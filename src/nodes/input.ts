import { NodeType } from "../core/node-interface";

export const InputNodeConfig = {
  name: 'input',
  type:NodeType.inputNode,
  evaluFunction: undefined,
  paramsDescriptor: [
    {
      name: "dataport"
    },
  ]
}