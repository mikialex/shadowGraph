import { NevaNodeGraph } from "@/core/node-graph";
import { NodeConfig } from "./node-interface";

import { AdditionNodeConfig } from '../nodes/addition';
import { InputNodeConfig } from '../nodes/input';
import { ConditionNodeConfig } from '../nodes/condition';

const innerNodeTypes = [AdditionNodeConfig, InputNodeConfig, ConditionNodeConfig];

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

  registerNodeConfig(conf: NodeConfig) {
    this.nodeConfigs[conf.name] = conf;
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