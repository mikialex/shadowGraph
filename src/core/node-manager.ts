import { NevaNodeGroup } from "./node-group";
import { NodeConfig } from "./node-interface";

export class NodeManager {
  constructor() {
    this.mainNodeGroup = new NevaNodeGroup({
      name:'main'
    });
    this.currentNodeGroup = this.mainNodeGroup;
  }

  nodeGroupList: NevaNodeGroup[] =[];
  mainNodeGroup: NevaNodeGroup;
  currentNodeGroup: NevaNodeGroup;

  nodeConfigList: NodeConfig[];

  registerNodeConfig(conf: NodeConfig) {
    this.nodeConfigList.push(conf);
  }
}