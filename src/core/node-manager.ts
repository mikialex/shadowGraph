import { NevaNodeGroup } from "./node-group";
import { NodeConfig } from "./node-interface";
import { NevaNodeEvalMachine } from "@/core/eval-machine";

export class NodeManager {
  constructor() {
    this.mainNodeGroup = new NevaNodeGroup({
      name:'main'
    });
    this.currentNodeGroup = this.mainNodeGroup;
    this.evalMachine = new NevaNodeEvalMachine(this);
  }

  evalMachine: NevaNodeEvalMachine;

  nodeGroupList: NevaNodeGroup[] =[];
  mainNodeGroup: NevaNodeGroup;
  currentNodeGroup: NevaNodeGroup;

  nodeConfigList: NodeConfig[];

  registerNodeConfig(conf: NodeConfig) {
    this.nodeConfigList.push(conf);
  }

  toJSON() {
    
  }

  downLoadAll() {
    
  }

}