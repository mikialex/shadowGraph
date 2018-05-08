export const AdditionNodeConfig = {
  type: 'addition',
  evaluFunction: (params: any[]) => {
    return params[0] + params[1];
  },
  paramsDescriptor: [
    {
      name: "number1"
    },
    {
      name: "number2"
    }
  ]
}