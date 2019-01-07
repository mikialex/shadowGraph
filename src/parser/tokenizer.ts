import { Token, TokenType } from "@/parser/token";
import { builtIn } from "@/parser/bulit-in";
import { literal } from "@/parser/literal";
import { operator } from "@/parser/operator";
import { generateUUID } from '@/util/uuid';

export class GLSLTokenizer {
  constructor() {
    this.builtinsDict = {};
    this.literalsDict = {};
    builtIn.forEach(item => {
      this.builtinsDict[item] = true
    })
    literal.forEach(item => {
      this.literalsDict[item] = true
    });
    this.operators = operator;
  }

  builtinsDict: { [index: string]: boolean };
  literalsDict: { [index: string]: boolean };
  operators: string[];

  currentCharactor: string = '';
  currentLastCharactor: string = '';
  currentTokenStartIndex = 0;
  currentIndex: number = 0;
  currentLine: number = 0;
  currentColum: number = 0;
  currentMode: TokenType = TokenType.NORMAL;
  content: string[] = [];

  totalCharactorParsed: number = 0;

  input: string = '';
  tokens: Token[] = [];

  collectCurrentCharactor() {
    this.content.push(this.currentCharactor);
  }

  switchMode(mode: TokenType) {
    this.currentMode = mode;
  }

  read() {
    this.currentIndex++;
    return;
  }

  recordCurrentCharactor() {
    this.currentLastCharactor = this.currentCharactor;
  }

  stepForwardWithRecordAndCollect() {
    this.collectCurrentCharactor()
    this.recordCurrentCharactor()
    this.read();
  }

  getContentStr() {
    return this.content.join('');
  }


  createToken(content: string) {
    this.tokens.push({
      type: this.currentMode,
      content: content,
      position: this.currentIndex,
      line: this.currentLine,
      colum: this.currentColum,
      uuid: generateUUID()
    })
  }

  lexToken() {
    if (/[^\d\w_]/.test(this.currentCharactor)) {
      var contentstr = this.getContentStr()
      if (this.literalsDict[contentstr]) {
        this.switchMode(TokenType.KEYWORD)
      } else if (this.builtinsDict[contentstr]) {
        this.switchMode(TokenType.BUILTIN)
      } else {
        this.switchMode(TokenType.IDENT)
      }
      this.createToken(this.getContentStr())
      this.switchMode(TokenType.NORMAL)
      return
    }
    this.stepForwardWithRecordAndCollect();
    return;
  }

  parseNormal() {
    this.content = []

    // start block comment
    if (this.currentLastCharactor === '/' && this.currentCharactor === '*') {
      this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex - 1
      this.switchMode(TokenType.BLOCK_COMMENT)
      this.recordCurrentCharactor()
      this.read();
      return;
    }

    // start line comment
    if (this.currentLastCharactor === '/' && this.currentCharactor === '/') {
      this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex - 1
      this.switchMode(TokenType.LINE_COMMENT)
      this.recordCurrentCharactor();
      this.read()
      return;
    }

    // start a prepocessor
    if (this.currentCharactor === '#') {
      this.switchMode(TokenType.PREPROCESSOR)
      this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex;
      return;
    }

    if (/\s/.test(this.currentCharactor)) {
      this.switchMode(TokenType.WHITESPACE)
      this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex;
      return;
    }

    const isnum = /\d/.test(this.currentCharactor)
    const isoperator = /[^\w_]/.test(this.currentCharactor)

    this.currentTokenStartIndex = this.totalCharactorParsed + this.currentIndex;
    if (isnum) {
      this.switchMode(TokenType.INTEGER)
    } else {
      if (isoperator) {
        this.switchMode(TokenType.OPERATOR)
      } else {
        this.switchMode(TokenType.TOKEN)
      }
    }
    return;
  }



  private lexPreprocessor() {
    if ((this.currentCharactor === '\r' || this.currentCharactor === '\n') && this.currentLastCharactor !== '\\') {
      this.createToken(this.getContentStr())
      this.switchMode(TokenType.NORMAL)
      return
    }
    this.stepForwardWithRecordAndCollect();
    return;
  }

  private lexLineComment() {
    // as same as lexPreprocessor
    if ((this.currentCharactor === '\r' || this.currentCharactor === '\n') && this.currentLastCharactor !== '\\') {
      this.createToken(this.getContentStr())
      this.switchMode(TokenType.NORMAL)
      return
    }
    this.stepForwardWithRecordAndCollect();
    return;
  }

  private lexBlockComment() {
    if (this.currentCharactor === '/' && this.currentLastCharactor === '*') {
      this.collectCurrentCharactor()
      this.createToken(this.getContentStr())
      this.switchMode(TokenType.NORMAL)
      this.read();
      return;
    }

    this.collectCurrentCharactor()
    this.recordCurrentCharactor()
    this.read();
    return;
  }

  private lexOperator() {
    if (this.currentLastCharactor === '.' && /\d/.test(this.currentCharactor)) {
      this.switchMode(TokenType.FLOAT)
      return
    }

    if (this.currentLastCharactor === '/' && this.currentCharactor === '*') {
      this.switchMode(TokenType.BLOCK_COMMENT)
      return
    }

    if (this.currentLastCharactor === '/' && this.currentCharactor === '/') {
      this.switchMode(TokenType.LINE_COMMENT)
      return
    }

    if (this.currentCharactor === '.' && this.content.length) {
      while (this.determineOperator(this.content));

      this.switchMode(TokenType.FLOAT)
      return
    }

    if (this.currentCharactor === ';' || this.currentCharactor === ')' || this.currentCharactor === '(') {
      if (this.content.length) while (this.determineOperator(this.content));
      this.createToken(this.currentCharactor)
      this.switchMode(TokenType.NORMAL)
      this.read();
      return;
    }

    var is_composite_operator = this.content.length === 2 && this.currentCharactor !== '='
    if (/[\w_\d\s]/.test(this.currentCharactor) || is_composite_operator) {
      while (this.determineOperator(this.content));
      this.switchMode(TokenType.NORMAL)
      return
    }

    this.stepForwardWithRecordAndCollect();
    return;
  }

  private determineOperator(buf) {
    var j = 0
      , idx
      , res

    do {
      idx = this.operators.indexOf(buf.slice(0, buf.length + j).join(''))
      res = this.operators[idx]

      if (idx === -1) {
        if (j-- + buf.length > 0) continue
        res = buf.slice(0, 1).join('')
      }

      this.createToken(res)

      this.currentTokenStartIndex += res.length
      this.content = this.content.slice(res.length)
      return this.content.length
    } while (1)
  }

  private lexHex() {
    if (/[^a-fA-F0-9]/.test(this.currentCharactor)) {
      this.createToken(this.getContentStr())
      this.switchMode(TokenType.NORMAL)
      return
    }

    this.stepForwardWithRecordAndCollect();
    return;
  }

  private lexInteger() {
    if (this.currentCharactor === '.') {
      this.switchMode(TokenType.FLOAT)
      this.stepForwardWithRecordAndCollect();
      return;
    }

    if (/[eE]/.test(this.currentCharactor)) {
      this.switchMode(TokenType.FLOAT)
      this.stepForwardWithRecordAndCollect();
      return;
    }

    if (this.currentCharactor === 'x' && this.content.length === 1 && this.content[0] === '0') {
      this.switchMode(TokenType.HEX)
      this.stepForwardWithRecordAndCollect();
      return;
    }

    if (/[^\d]/.test(this.currentCharactor)) {
      this.createToken(this.getContentStr())
      this.switchMode(TokenType.NORMAL)
      return
    }

    this.collectCurrentCharactor()
    this.recordCurrentCharactor()
    this.read();
    return;
  }

  private lexDecimal() {
    if (this.currentCharactor === 'f') {
      this.stepForwardWithRecordAndCollect();
    }

    if (/[eE]/.test(this.currentCharactor)) {
      this.stepForwardWithRecordAndCollect();
      return;
    }

    if (this.currentCharactor === '-' && /[eE]/.test(this.currentLastCharactor)) {
      this.stepForwardWithRecordAndCollect();
      return;
    }

    if (/[^\d]/.test(this.currentCharactor)) {
      this.createToken(this.getContentStr())
      this.switchMode(TokenType.NORMAL)
      return
    }

    this.stepForwardWithRecordAndCollect();
    return;
  }

  private lexWhitespace() {
    if (/[^\s]/g.test(this.currentCharactor)) { // new space with a new line start /or space end
      this.createToken(this.getContentStr())
      this.switchMode(TokenType.NORMAL)
      return;
    }
    this.stepForwardWithRecordAndCollect();
    return;
  }

  public tokenize(inputStr: string) {
    inputStr += '\n';
    this.reset();
    this.input += inputStr.replace(/\r\n/g, '\n'); // repalce nextline to \n

    while (this.currentIndex <= inputStr.length) {

      this.currentCharactor = inputStr[this.currentIndex];
      const last = this.currentIndex;

      switch (this.currentMode) {
        case TokenType.BLOCK_COMMENT: this.lexBlockComment(); break
        case TokenType.LINE_COMMENT: this.lexLineComment(); break
        case TokenType.PREPROCESSOR: this.lexPreprocessor(); break
        case TokenType.OPERATOR: this.lexOperator(); break
        case TokenType.INTEGER: this.lexInteger(); break
        case TokenType.HEX: this.lexHex(); break
        case TokenType.FLOAT: this.lexDecimal(); break
        case TokenType.TOKEN: this.lexToken(); break // not emit
        case TokenType.WHITESPACE: this.lexWhitespace(); break
        case TokenType.NORMAL: this.parseNormal(); break // not emit
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

  public reset() {
    this.currentCharactor= '';
    this.currentLastCharactor = '';
    this.currentTokenStartIndex = 0;
    this.currentIndex = 0;
    this.currentLine = 0;
    this.currentColum = 0;
    this.currentMode = TokenType.NORMAL;
    this.content = [];

    this.totalCharactorParsed = 0;

    this.input = '';
    this.tokens = [];
  }


}