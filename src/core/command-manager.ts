import { Command } from "@/core/command";

export class CommandManager{
  commands = {};

  registCommand(commmand: Command) {
    this.commands[commmand.name] = commmand;
  }


}