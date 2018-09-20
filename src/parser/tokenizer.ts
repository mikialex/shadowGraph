import { Token, TokenType } from "@/parser/token";
import { builtIn } from "@/parser/bulit-in";
import { literal } from "@/parser/literal";

enum TokenizeMode {
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

function getTokenType(mode): TokenType {
  return;
}

export class GLSLTokenizer {
  constructor() {
    this.builtinsDict = {};
    this.literalsDict = {};
    builtIn.forEach(item => {
      this.builtinsDict[item] = true
    })
    literal.forEach(item => {
      this.literalsDict[item] = true
    })
  }

  builtinsDict: { [index: string]: boolean }; 
  literalsDict: { [index: string]: boolean }; 

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

  collectCurrentCharactor() {
    this.content.push(this.currentCharactor);
  }

  switchMode(mode: TokenizeMode) {
    this.currentMode = mode;
  }


  createToken(content: string) {
    this.tokens.push({
      type: getTokenType(this.currentMode),
      content: content,
      position: this.currentIndex,
      line: this.currentLine,
      colum: this.currentColum,
    })
  }

  parseToken() {
    if (/[^\d\w_]/.test(this.currentCharactor)) {
      var contentstr = this.content.join('')
      if (this.literalsDict[contentstr]) {
        this.switchMode(TokenizeMode.KEYWORD)
      } else if (this.builtinsDict[contentstr]) {
        this.switchMode(TokenizeMode.BUILTIN)
      } else {
        this.switchMode(TokenizeMode.IDENT)
      }
      this.createToken(this.content.join(''))
      this.switchMode(TokenizeMode.NORMAL)
      return this.currentIndex
    }
    this.collectCurrentCharactor()
    this.currentLastCharactor = this.currentCharactor
    return this.currentIndex + 1
  }

  parseNormal() {
    this.content = this.content.length ? [] : this.content;

    // start block comment
    if (this.currentLastCharactor === '/' && this.currentCharactor === '*') {
      this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex - 1
      this.switchMode(TokenizeMode.BLOCK_COMMENT)
      this.currentLastCharactor = this.currentCharactor
      return this.currentIndex + 1
    }

    // start line comment
    if (this.currentLastCharactor === '/' && this.currentCharactor === '/') {
      this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex - 1
      this.switchMode(TokenizeMode.LINE_COMMENT)
      this.currentLastCharactor = this.currentCharactor
      return this.currentIndex + 1;
    }

    if (this.currentCharactor === '#') {
      this.switchMode(TokenizeMode.PREPROCESSOR)
      this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex;
      return this.currentIndex;
    }

    if (/\s/.test(this.currentCharactor)) {
      this.switchMode(TokenizeMode.WHITESPACE)
      this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex;
      return this.currentIndex;
    }

    const isnum = /\d/.test(this.currentCharactor)
    const isoperator = /[^\w_]/.test(this.currentCharactor)

    this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex;
    if (isnum) {
      this.switchMode(TokenizeMode.INTEGER)
    } else {
      if (isoperator) {
        this.switchMode(TokenizeMode.OPERATOR)
      } else {
        this.switchMode(TokenizeMode.TOKEN)
      }
    }
    return this.currentIndex;
  }



  private preprocessor() {
    if((this.currentCharactor === '\r' || this.currentCharactor === '\n') && this.currentLastCharactor !== '\\') {
      this.createToken(this.content.join(''))
      this.switchMode(TokenizeMode.NORMAL)
      return this.currentIndex
    }
    this.collectCurrentCharactor()
    this.currentLastCharactor = this.currentCharactor
    return this.currentIndex + 1
  }

  private line_comment() {
     // as same as preprocessor
     if((this.currentCharactor === '\r' || this.currentCharactor === '\n') && this.currentLastCharactor !== '\\') {
      this.createToken(this.content.join(''))
      this.switchMode(TokenizeMode.NORMAL)
      return this.currentIndex
    }
    this.collectCurrentCharactor()
    this.currentLastCharactor = this.currentCharactor
    return this.currentIndex + 1
  }

  private block_comment() {
    if(this.currentCharactor === '/' && this.currentLastCharactor === '*') {
      this.collectCurrentCharactor()
      this.createToken(this.content.join(''))
      this.switchMode(TokenizeMode.NORMAL)
      return this.currentIndex + 1
    }

    this.collectCurrentCharactor()
    this.currentLastCharactor = this.currentCharactor
    return this.currentIndex + 1
  }

  private operator() {
    if(this.currentLastCharactor === '.' && /\d/.test(this.currentCharactor)) {
      this.switchMode(TokenizeMode.FLOAT)
      return this.currentIndex
    }

    if(this.currentLastCharactor === '/' && this.currentCharactor === '*') {
      this.switchMode(TokenizeMode.BLOCK_COMMENT)
      return this.currentIndex
    }

    if(this.currentLastCharactor === '/' && this.currentCharactor === '/') {
      this.switchMode(TokenizeMode.LINE_COMMENT)
      return this.currentIndex
    }

    if(this.currentCharactor === '.' && this.content.length) {
      while(this.determine_operator(this.content));

      this.switchMode(TokenizeMode.FLOAT)
      return this.currentIndex
    }

    if(this.currentCharactor === ';' || this.currentCharactor === ')' || this.currentCharactor === '(') {
      if(this.content.length) while(this.determine_operator(this.content));
      this.createToken(this.currentCharactor)
      this.switchMode(TokenizeMode.NORMAL)
      return this.currentIndex + 1
    }

    var is_composite_operator = this.content.length === 2 && this.currentCharactor !== '='
    if(/[\w_\d\s]/.test(this.currentCharactor) || is_composite_operator) {
      while(this.determine_operator(this.content));
      this.switchMode(TokenizeMode.NORMAL)
      return this.currentIndex
    }

    this.collectCurrentCharactor()
    this.currentLastCharactor = this.currentCharactor
    return this.currentIndex + 1
  }

  private determine_operator(buf) {
    var j = 0
      , idx
      , res

    do {
      idx = operators.indexOf(buf.slice(0, buf.length + j).join(''))
      res = operators[idx]

      if(idx === -1) {
        if(j-- + buf.length > 0) continue
        res = buf.slice(0, 1).join('')
      }

      this.createToken(res)

      start += res.length
      this.content = this.content.slice(res.length)
      return this.content.length
    } while(1)
  }

  private hex() {
    if(/[^a-fA-F0-9]/.test(this.currentCharactor)) {
      this.createToken(this.content.join(''))
      this.switchMode(TokenizeMode.NORMAL)
      return this.currentIndex
    }

    this.collectCurrentCharactor()
    this.currentLastCharactor = this.currentCharactor
    return this.currentIndex + 1
  }

  private integer() {
    if(this.currentCharactor === '.') {
      this.collectCurrentCharactor()
      this.switchMode(TokenizeMode.FLOAT)
      this.currentLastCharactor = this.currentCharactor
      return this.currentIndex + 1
    }

    if(/[eE]/.test(this.currentCharactor)) {
      this.collectCurrentCharactor()
      this.switchMode(TokenizeMode.FLOAT)
      this.currentLastCharactor = this.currentCharactor
      return this.currentIndex + 1
    }

    if(this.currentCharactor === 'x' && this.content.length === 1 && this.content[0] === '0') {
      this.switchMode(TokenizeMode.HEX)
      this.collectCurrentCharactor()
      this.currentLastCharactor = this.currentCharactor
      return this.currentIndex + 1
    }

    if(/[^\d]/.test(this.currentCharactor)) {
      this.createToken(this.content.join(''))
      this.switchMode(TokenizeMode.NORMAL)
      return this.currentIndex
    }

    this.collectCurrentCharactor()
    this.currentLastCharactor = this.currentCharactor
    return this.currentIndex + 1
  }

  private decimal() {
    if(this.currentCharactor === 'f') {
      this.collectCurrentCharactor()
      this.currentLastCharactor = this.currentCharactor
      this.currentIndex += 1
    }

    if(/[eE]/.test(this.currentCharactor)) {
      this.collectCurrentCharactor()
      this.currentLastCharactor = this.currentCharactor
      return this.currentIndex + 1
    }

    if (this.currentCharactor === '-' && /[eE]/.test(this.currentLastCharactor)) {
      this.collectCurrentCharactor()
      this.currentLastCharactor = this.currentCharactor
      return this.currentIndex + 1
    }

    if(/[^\d]/.test(this.currentCharactor)) {
      this.createToken(this.content.join(''))
      this.switchMode(TokenizeMode.NORMAL)
      return this.currentIndex
    }

    this.collectCurrentCharactor()
    this.currentLastCharactor = this.currentCharactor
    return this.currentIndex + 1
  }






  private parseWhitespace(): number {
    if (/[^\s]/g.test(this.currentCharactor)) { // new space with a new line start /or space end
      this.createToken(this.content.join(''))
      this.switchMode(TokenizeMode.NORMAL)
      return this.currentIndex;
    }
    this.collectCurrentCharactor();
    this.currentLastCharactor = this.currentCharactor;
    return this.currentIndex + 1;
  }

  public tokenize(inputStr: string) {
    this.input += inputStr.replace(/\r\n/g, '\n'); // repalce nextline to \n

    this.currentIndex = 0;
    let last;

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
        case TokenizeMode.TOKEN: this.currentIndex = this.parseToken(); break
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