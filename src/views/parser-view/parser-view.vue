<template>
  <div>
    <textarea 
    class="input-field"
    spellcheck="false"
    v-model="inputStr"></textarea>

    <button @click="tokenize">tokenize</button>

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
  inputStr='';

  tokenize(){
    tokenizer.reset();
    console.log(tokenizer.tokenize(this.inputStr));
  }
}
</script>

<style scoped lang="scss">
.input-field{
  width:600px;
  height:500px;
}
</style>
