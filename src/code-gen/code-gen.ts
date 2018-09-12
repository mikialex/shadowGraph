import { NevaNode } from "@/core/node";
import { FunctionNode } from "@/core/function-node";

export interface CodeGenVarDescriptor {
  varKey: string;
  refedNode: FunctionNode;
  exp: string;
}

export interface CodeGenContext {
  varList: CodeGenVarDescriptor[];
}

export function convertCodeGenContext2Exp(ctx: CodeGenContext): string {
  let str = '';
  const varList = ctx.varList.slice();
  const returnVar = varList.shift();
  varList.forEach(v => {
    str += `var ${v.varKey} = ${v.exp}`;
    str += '\n';
  });

  str += `return  ${returnVar.exp}`;
  str += '\n';
  return str
}

export function convertCodeGenContext2Function(ctx: CodeGenContext): string {
  let str = '';

  return ''
}

let tempId = 0;
export function codeGen(ctx: CodeGenContext) {
  const currentVar = ctx.varList[ctx.varList.length - 1];
  const nodeToGen = currentVar.refedNode;

  let str = nodeToGen.codeGenTemplate;
  if (nodeToGen.isInputNode) {
    str = str.replace(`{{p1}}`, nodeToGen.getValue().toString());
  } else {
    nodeToGen.inputParams.forEach((input, index) => {
      const paramNode = input.valueRef;
      let replacer;

      if (!paramNode) {
        if (!nodeToGen.config.paramsDescriptor[index].required) {
          throw 'error';
        }
        replacer = nodeToGen.config.paramsDescriptor[index].default;
      } else {
        let hasGened = false;
        let oldGenKey;
        for (let i = 0; i < ctx.varList.length; i++) {
          if (ctx.varList[i].refedNode.id === paramNode.id) {
            hasGened = true;
            oldGenKey = ctx.varList[i].varKey
            break;
          }
        }
        if (!hasGened) {
          const position = ctx.varList.length;
          tempId++;
          const newVarKey = 'temp' + tempId;
          const newVar = {
            varKey: newVarKey,
            refedNode: paramNode as FunctionNode,
            exp: ''
          }
          ctx.varList.push(newVar);
          codeGen(ctx);

          if (paramNode.refedNodes.length > 1) {
            replacer = newVarKey;
          } else {
            ctx.varList.splice(position, 1);
            replacer = newVar.exp;
          }
        } else {
          replacer = oldGenKey;
        }

      }

      str = str.replace(`{{p${index + 1}}}`, replacer);

    })
  }
  currentVar.exp = str;
  return ctx;
}

export class GraphCodeGenerator {
  codeGenFunctionNode(node: FunctionNode): string {
    const ctx = {
      varList: [{
        varKey: '',
        refedNode: node,
        exp: ''
      }]
    };
    codeGen(ctx);
    console.log(ctx);
    return convertCodeGenContext2Exp(ctx);
  }
}