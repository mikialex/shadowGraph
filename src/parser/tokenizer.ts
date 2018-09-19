import { Token, TokenType } from "@/parser/token";

enum TokenizeMode{
  NORMAL = 9999,      // <-- never emitted
  TOKEN = 999,         // <-- never emitted
  BLOCK_COMMENT,
  LINE_COMMENT = 1,
  PREPROCESSOR = 2,
  OPERATOR = 3,
  INTEGER = 4,
  FLOAT = 5,
  INDENT = 6,
  BUILTIN = 7,
  KEYWORD = 8,
  WHITESPACE = 9,
  EOF = 10,
  HEX = 11,
}

function getTokenType(mode): TokenType{
  return;
}

export class GLSLTokenizer{
  constructor() {
    
  }

  currentCharactor: string = '';
  currentLastCharactor: string = '';
  currentTokenStartIndex = 0;
  currentIndex: number = 0;
  currentLine: number = 0;
  currentColum: number = 0;
  currentMode: TokenizeMode;
  content: string[] = [];

  totalCharactorParsed: number = 0;

  input: string;
  tokens: Token[];

  createToken(content:string) {
    this.tokens.push({
      type: getTokenType(this.currentMode),
      content: content,
      position: this.currentIndex,
      line: this.currentLine,
      colum: this.currentColum,
    })
  }

  parseNormal() {
    this.content = this.content.length ? [] : this.content;

  if (this.currentLastCharactor === '/' && this.currentCharactor === '*') {
    this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex - 1
    this.currentMode = TokenizeMode.BLOCK_COMMENT
    this.currentLastCharactor = this.currentCharactor
    return this.currentIndex + 1
  }

  if (this.currentLastCharactor === '/' && this.currentCharactor === '/') {
    this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex - 1
    this.currentMode = TokenizeMode.LINE_COMMENT
    this.currentLastCharactor = this.currentCharactor
    return this.currentIndex + 1;
  }

  if (this.currentCharactor === '#') {
    this.currentMode = TokenizeMode.PREPROCESSOR
    this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex;
    return this.currentIndex;
  }

  if (/\s/.test(this.currentCharactor)) {
    this.currentMode = TokenizeMode.WHITESPACE
    this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex;
    return this.currentIndex;
  }

  const isnum = /\d/.test(this.currentCharactor)
  const isoperator = /[^\w_]/.test(this.currentCharactor)

    this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex;
    if (isnum) {
      this.currentMode = TokenizeMode.INTEGER;
    } else {
      if (isoperator) {
        this.currentMode = TokenizeMode.OPERATOR;
      } else {
        this.currentMode = TokenizeMode.TOKEN;
      }
    }
    return this.currentIndex;
}

  private parseWhitespace(): number {
    if (/[^\s]/g.test(this.currentCharactor)) {
      this.createToken(this.content.join(''))
      this.currentMode = TokenizeMode.WHITESPACE;
      return this.currentIndex;
    }
    this.content.push(this.currentCharactor);
    this.currentLastCharactor = this.currentCharactor;
    return this.currentIndex + 1;
  }

  public tokenize(inputStr:string) {
    this.input += inputStr.replace(/\r\n/g, '\n'); // repalce nextline to \n

    this.currentIndex = 0;
    let last;

    // parse a token each step
    while (this.currentCharactor = inputStr[this.currentIndex], this.currentIndex < inputStr.length) {
      last = this.currentIndex;

      switch (this.currentMode) {
        // case TokenizeMode.BLOCK_COMMENT: this.currentIndex = this.block_comment(); break
        // case TokenizeMode.LINE_COMMENT: this.currentIndex = this.line_comment(); break
        // case TokenizeMode.PREPROCESSOR: this.currentIndex = this.preprocessor(); break
        // case TokenizeMode.OPERATOR: this.currentIndex = this.operator(); break
        // case TokenizeMode.INTEGER: this.currentIndex = this.integer(); break
        // case TokenizeMode.HEX: this.currentIndex = this.hex(); break
        // case TokenizeMode.FLOAT: this.currentIndex = this.decimal(); break
        // case TokenizeMode.TOKEN: this.currentIndex = this.readtoken(); break
        case TokenizeMode.WHITESPACE: this.currentIndex = this.parseWhitespace(); break
        case TokenizeMode.NORMAL: this.currentIndex = this.parseNormal(); break
      }

      // update token Position
      if (last !== this.currentIndex) {
        switch (inputStr[last]) {
          case '\n':
            this.currentColum = 0;
            this.currentLine++;
            break
          default:
            this.currentColum++;
            break
        }
      }
    }

    this.totalCharactorParsed += this.currentIndex;
    inputStr = inputStr.slice(this.currentIndex);
    return this.tokens;
  }




}