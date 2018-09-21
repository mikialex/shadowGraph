<template>
  <div class="home">
    <shadowBoardCom/>
    <GraphInfo/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import shadowBoardCom from "@/components/board.vue"; // @ is an alias to /src
import GraphInfo from '@/components/graph-info.vue';
import { BaseNode } from "../core/node";
import { GraphNode } from "../core/graph-node";

@Component({
  components: {
    shadowBoardCom, GraphInfo
  }
})
export default class Home extends Vue {
  mounted() {
  }
}
</script>
