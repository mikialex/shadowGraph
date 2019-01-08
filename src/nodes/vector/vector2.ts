import { NodeConfig, NodeType } from '@/core/node-interface';
import { Vector2 } from '@/math.ts/vector2';

export const Vector2InputNodeConfig: NodeConfig = {
  isBuiltIn: true,
  name: 'vector2-input',
  type: NodeType.inputNode,
  isInputNode: true,
  defaultValue: new Vector2(),
  evaluFunction: undefined,
  paramsDescriptor: [
    {
      name: "dataport"
    },
  ],
  codeGen: '{{p1}}'
}