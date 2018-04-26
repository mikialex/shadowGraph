import { NevaNode, FunctionNode } from "./node";

let constInputNodeA = new FunctionNode({
  evaluFunction: (params: any[]) => {
    return 12;
  },
  paramsDescriptor: []
})

let constInputNodeB = new FunctionNode({
  evaluFunction: (params: any[]) => {
    return 3;
  },
  paramsDescriptor: []
})


let additionNode = new FunctionNode({
  evaluFunction: (params: any[]) => {
    return params[0] + params[1];
  },
  paramsDescriptor: [
    {
      name: 'number1'
    },
    {
      name: 'number2'
    }
  ]
});

constInputNodeA.pipeTo(additionNode, 'number1');
constInputNodeB.pipeTo(additionNode, 'number2');

constInputNodeA.evaluate();
constInputNodeB.evaluate();
additionNode.evaluate();

console.log(additionNode);
console.log(additionNode.getOutput());