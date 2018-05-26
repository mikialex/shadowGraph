import { NevaNodeGroup } from "./node-group";
import { NodeConfig } from "./node-interface";

export class NodeManager {
  constructor() {
    this.mainNodeGroup = new NevaNodeGroup({
      name:'main'
    });
  }

  nodeGroupList: NevaNodeGroup[] =[];
  mainNodeGroup: NevaNodeGroup;

  nodeConfigList: NodeConfig[];

  registerNodeConfig(conf: NodeConfig) {
    this.nodeConfigList.push(conf);
  }
}