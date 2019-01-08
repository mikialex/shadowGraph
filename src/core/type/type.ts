export const enum primitiveType{
  INT = 'int',
  FLOAT = 'float',
  BOOLEAN = 'boolean',

}

export abstract class TypeBase{
  reference: TypeBase;
  abstract checkIsEqual(typeToCheck: TypeBase): boolean;
}

export class PrimitiveType extends TypeBase{
  primitiveType: primitiveType;

  checkIsEqual(typeToCheck: TypeBase) {
    if (typeToCheck instanceof PrimitiveType) {
      return typeToCheck.primitiveType === this.primitiveType;
    }
    return false;
  }
}

export abstract class GenericTypeBase extends TypeBase{
  typeParameters: [];

  defineTypeParameter() {
    
  }
}

export class StructedType extends GenericTypeBase{
  name: string = '';
  memberTypeList: { [index: string]: TypeBase } = {};

  defineType(key: string, type: TypeBase) {
    if (this.memberTypeList[key] !== undefined) {
      throw 'cant defined dulplicate name';
    }
    this.memberTypeList[key] = type;
  }
  
  checkIsEqual(typeToCheck: TypeBase) {
    if (typeToCheck instanceof StructedType) {
      for (const typeName in typeToCheck.memberTypeList) {
        const selfProperty = this.memberTypeList[typeName];
        if ( selfProperty === undefined) {
          return false;
        }
        const typepropertyToCheck = typeToCheck.memberTypeList[typeName];
        if (!selfProperty.checkIsEqual(typepropertyToCheck)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  codeGen() {
    if (this.name === undefined) {
      throw 'only named structure can gen code'
    }
    let str = '';
    
  }
}

export class GenericInjectType extends TypeBase{
  checkIsEqual() {
    return false;
  }
}

export class FunctionType extends GenericTypeBase{
  inputParams: TypeBase[];
  returnType: TypeBase;

  checkIsEqual() {
    return false;
  }
}

export class UnionType extends GenericTypeBase{
  name: string = '';
  unionedTypeList: TypeBase[];

  addType(newType: TypeBase) {
    for (const type of this.unionedTypeList) {
      if (type === newType) {
        throw 'cant add duplicate type to union type';
      }
    }
    this.unionedTypeList.push(newType);
  }

  checkIsEqual(typeToCheck: TypeBase) {
    if (typeToCheck instanceof UnionType) {

    }
    return false;
  }
}


