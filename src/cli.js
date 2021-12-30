import createApp from "./create-app";
import addFunction from "./add-function";
import addEntity from "./add-entity";
import chalk from 'chalk';

const commands = {
  "create-app": async (args) => await createApp(args),
  "add-function": async (args) => await addFunction(args),
  "add-entity": async (args) => await addEntity(args),
};

export const cli = async (args) => {
  if (!commands[args[2]]) {
    console.log(`%s ${Object.keys(commands)}`, chalk.blue('LIST OF COMMANDS'));
    return;
  }
  await commands[args[2]](args);
}
