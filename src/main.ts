import { NevaNode } from "./node";

let additionNode = new NevaNode({
  evaluFunction: (params:any[]) => {
    return params[0] + params[1];
  },
  paramsDescriptor: [
    {
      name: 'number1',
      type: 'number'
    },
    {
      name: 'number2',
      type: 'number'
    }
  ]
});

console.log(additionNode);