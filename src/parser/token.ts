export enum TokenType {
  NORMAL = 9999,      // <-- never emitted
  TOKEN = 999,         // <-- never emitted
  BLOCK_COMMENT,
  LINE_COMMENT = 1,
  PREPROCESSOR = 2,
  OPERATOR = 3,
  INTEGER = 4,
  FLOAT = 5,
  IDENT = 6,
  BUILTIN = 7,
  KEYWORD = 8,
  WHITESPACE = 9,
  EOF = 10,
  HEX = 11,
}

export interface Token{
  type: TokenType;
  content: string;
  position: number;
  line: number;
  colum: number;
}