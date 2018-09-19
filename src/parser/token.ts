export enum TokenType{

}

export interface Token{
  type: TokenType;
  content: string;
  position: number;
  line: number;
  colum: number;
}