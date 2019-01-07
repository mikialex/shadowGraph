export const enum TokenType {
  NORMAL = 'normal',      // <-- never emitted
  TOKEN = 'token',         // <-- never emitted
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
  EOF = 'eof',
  HEX = 'hex number',
}

export interface Token{
  type: TokenType;
  content: string;
  position: number;
  line: number;
  colum: number;
  uuid: string
}