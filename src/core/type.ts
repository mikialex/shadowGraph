export const enum primitiveType{
  INT = 'int',
  FLOAT = 'float',
  BOOLEAN = 'boolean',

}

export abstract class TypeBase{
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

export class StructedType extends TypeBase{
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
}

export class UnionType extends TypeBase{
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


