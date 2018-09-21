export const enum TokenType {
  NORMAL = 9999,      // <-- never emitted
  TOKEN = 999,         // <-- never emitted
  BLOCK_COMMENT= 'block comment',
  LINE_COMMENT = 'line comment',
  PREPROCESSOR = 'preporcessor',
  OPERATOR = 'operator',
  INTEGER = 'integer',
  FLOAT = 'float',
  IDENT = 'ident',
  BUILTIN = 'inner func',
  KEYWORD = 'keyworld',
  WHITESPACE = 'space',
  EOF = 10,
  HEX = 'hex number',
}

export interface Token{
  type: TokenType;
  content: string;
  position: number;
  line: number;
  colum: number;
}