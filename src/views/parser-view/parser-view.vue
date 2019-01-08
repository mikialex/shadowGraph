<template>
  <div>
    <textarea 
    class="input-field"
    spellcheck="false"
    v-model="inputStr"></textarea>

    <button @click="tokenize">tokenize</button>

    <div>
      <div v-for="line in lineResults" :key="line.line">
        <div v-for="tk in line.tokens"
        :key="tk.uuid"
        class="token"
        >{{tk.content}}</div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {GLSLTokenizer} from '@/parser/tokenizer';

const tokenizer = new GLSLTokenizer();

@Component({
  components: {
  }
})
export default class ParserView extends Vue {
  inputStr=
  `
  function a() {
    return a
  }
  // a
  
  `;

  result = [];
  lineResults = [];

  tokenize(){
    tokenizer.reset();
    this.result = tokenizer.tokenize(this.inputStr);
    console.log(this.result);
    this.lineResults = [];
    this.result.forEach(re=>{
      if(this.lineResults[re.line] === undefined){
        this.lineResults[re.line] = {
          line: re.line,
          tokens: []
        }
      }
      const line = this.lineResults[re.line];
      line.tokens.push(re)
    })
    for (let i = 0; i < this.lineResults.length; i++) {
      const line = this.lineResults[i];
      if(line === undefined) {
        this.lineResults[i] = {
          line: i,
          tokens: []
        }
      }
      
    }
    console.log(this.lineResults)
  }
}
</script>

<style scoped lang="scss">
.input-field{
  width:600px;
  height:500px;
}

.token{
  display: inline-block;
  padding: 5px;
  background: rgb(37, 129, 106);
  color:#fff;
  border-radius: 3px;
  margin:3px;
}
</style>
