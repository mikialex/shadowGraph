<template>
  <div class="home">
    <NevaBoardCom/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NevaBoardCom from "@/components/board.vue"; // @ is an alias to /src
import { NevaNode, FunctionNode } from "../core/node";

@Component({
  components: {
    NevaBoardCom
  }
})
export default class Home extends Vue {
  mounted() {
  }
}
</script>
