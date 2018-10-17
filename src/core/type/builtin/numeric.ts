import { builtInType } from './builtin';

export const numeric = {
  type: 'union',
  des: {
    name: 'numeric',
    types: [
      {
        type: builtInType.vec2
      },
      {
        type: builtInType.vec3
      },
      {
        type: builtInType.vec4
      },
    ]
  }
}

export const dualComposer = {
  type: 'function',
  des: {
    name: 'dualComposer',
    typeParameters: {
      'param': {

      }
    },
    inputTypes: {
      'x': {
        genaricTypeSlot: 'param'
      },
      'y': {
        genaricTypeSlot: 'param'
      },
    },
    returnTypes: {
      genaricTypeSlot: 'param'
    }
  }
}

export const dualNumericComposer = {
  type: 'genericInjector',
  des: {
    name: 'dualComposer',
    injectedType: 'dualComposer',
    injectedSlots: {
      'param': numeric
    },
  }
}



// type test<T> = (a: T, b: T) => T;
// type real = test<vec2 | vec3 | vec4>;