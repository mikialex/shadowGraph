import { NevaNodeGraph } from "@/core/node-graph";
import { NodeConfig, convertToStandardNodeConfig } from "./node-interface";

import { AdditionNodeConfig } from '../nodes/addition';
import { SubstractionNodeConfig } from '../nodes/substraction';
import { NumberInputNodeConfig } from '@/nodes/input-number';
import { BooleanInputNodeConfig } from '@/nodes/input-boolean';
import { ConditionNodeConfig } from '../nodes/condition';
import { GraphCodeGenerator } from "@/code-gen/code-gen";

const innerNodeTypes = [
  AdditionNodeConfig,
  SubstractionNodeConfig,
  NumberInputNodeConfig,
  BooleanInputNodeConfig,
  ConditionNodeConfig
];

export class NodeManager {
  constructor() {
    this.mainNodeGraph = new NevaNodeGraph({
      name: 'main'
    });
    this.currentNodeGraph = this.mainNodeGraph;
    innerNodeTypes.forEach(conf => {
      this.registerNodeConfig(conf);
    })
  }

  nodeGraphList: NevaNodeGraph[] = [];
  mainNodeGraph: NevaNodeGraph;
  currentNodeGraph: NevaNodeGraph;

  nodeConfigs: { [index: string]: NodeConfig } = {};

  codeGenerator: GraphCodeGenerator = new GraphCodeGenerator();

  registerNodeConfig(conf: NodeConfig) {
    this.nodeConfigs[conf.name] = convertToStandardNodeConfig(conf);
  }

  toJSON() {
    return {
      main: this.mainNodeGraph.toJSON(),
      nodeConfigs: Object.keys(this.nodeConfigs).map(key => this.nodeConfigs[key]).filter(conf => {
        return conf.isInner !== true;
      }),
    }
  }

  loadData(data: any) {
    const customConfig = data.nodeConfigs;
    const mainGraph = data.nodesInfo;
    customConfig.forEach(conf => {
      this.registerNodeConfig(conf);
    });

  }

  downLoadData() {
    
  }

}