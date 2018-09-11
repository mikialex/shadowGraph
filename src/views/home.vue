<template>
  <div class="home">
    <NevaBoardCom/>
    <GraphInfo/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NevaBoardCom from "@/components/board.vue"; // @ is an alias to /src
import GraphInfo from '@/components/graph-info.vue';
import { NevaNode } from "../core/node";
import { FunctionNode } from "../core/function-node";

@Component({
  components: {
    NevaBoardCom, GraphInfo
  }
})
export default class Home extends Vue {
  mounted() {
  }
}
</script>
