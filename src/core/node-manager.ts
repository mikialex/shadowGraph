import { NevaNodeGroup } from "./node-group";
import { NodeConfig } from "./node-interface";

import { AdditionNodeConfig } from '../nodes/addition';
import { InputNodeConfig } from '../nodes/input';
import { ConditionNodeConfig } from '../nodes/condition';

const innerNodeTypes = [AdditionNodeConfig, InputNodeConfig, ConditionNodeConfig];

export class NodeManager {
  constructor() {
    this.mainNodeGroup = new NevaNodeGroup({
      name: 'main'
    });
    this.currentNodeGroup = this.mainNodeGroup;
    innerNodeTypes.forEach(conf => {
      this.registerNodeConfig(conf);
    })
  }

  nodeGroupList: NevaNodeGroup[] = [];
  mainNodeGroup: NevaNodeGroup;
  currentNodeGroup: NevaNodeGroup;

  nodeConfigs: { [index: string]: NodeConfig } = {};

  registerNodeConfig(conf: NodeConfig) {
    this.nodeConfigs[conf.name] = conf;
  }

  toJSON() {
    return {
      main: this.mainNodeGroup.toJSON(),
      nodeConfigs: this.nodeConfigs,
    }
  }

  downLoadAll() {
    
  }

}