import { NodeGraph } from "@/core/node-graph";
import { NodeConfig, convertToStandardNodeConfig } from "./node-interface";

import { AdditionNodeConfig } from '../nodes/addition';
import { SubstractionNodeConfig } from '../nodes/substraction';
import { NumberInputNodeConfig } from '@/nodes/input-number';
import { BooleanInputNodeConfig } from '@/nodes/input-boolean';
import { ConditionNodeConfig } from '../nodes/condition';
import { GraphCodeGenerator } from "@/code-gen/code-gen";
import testData from "@/data/test-data.json";

const innerNodeTypes = [
  AdditionNodeConfig,
  SubstractionNodeConfig,
  NumberInputNodeConfig,
  BooleanInputNodeConfig,
  ConditionNodeConfig
];

export class NodeManager {
  constructor() {
    this.mainNodeGraph = new NodeGraph({
      name: 'main',
    }, this);
    this.currentNodeGraph = this.mainNodeGraph;
    innerNodeTypes.forEach(conf => {
      this.registerNodeConfig(conf);
    })
    this.loadData(testData);
  }

  nodeGraphList: NodeGraph[] = [];
  mainNodeGraph: NodeGraph;
  currentNodeGraph: NodeGraph;

  nodeConfigs: { [index: string]: NodeConfig } = {};

  codeGenerator: GraphCodeGenerator = new GraphCodeGenerator();

  registerNodeConfig(conf: NodeConfig) {
    this.nodeConfigs[conf.name] = convertToStandardNodeConfig(conf);
  }

  toJSON() {
    return {
      main: this.mainNodeGraph.toJSON(),
      nodeConfigs: Object.keys(this.nodeConfigs).map(key => this.nodeConfigs[key]).filter(conf => {
        return conf.isBuiltIn !== true;
      }),
    }
  }

  loadData(data: any) {
    const customConfig = data.nodeConfigs;
    const mainGraphData = data.main;
    customConfig.forEach(conf => {
      this.registerNodeConfig(conf);
    });
    this.mainNodeGraph.loadData(mainGraphData);
  }

  downLoadData() {
    
  }

}