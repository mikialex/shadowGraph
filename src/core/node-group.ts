import { NevaNode } from "./node";

export class NevaNodeGroup{
  constructor() {
    
  }

  nodes: NevaNode[];

  checkIsDuplicate(node) {
    return this.nodes.indexOf(node) !== -1;
  }

  addNode(node: NevaNode) {
    if (!this.checkIsDuplicate(node)) {
      this.nodes.push(node); 
    }
  }

  removeNode(node: NevaNode) {
    let position = this.nodes.indexOf(node);
    if (position === -1) {
      console.warn('try to remove a node that not exist in nodegroup')
      return;
    }
    this.nodes.splice(position, 1);
  }
  
}