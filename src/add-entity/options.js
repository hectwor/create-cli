import arg from "arg";
import inquirer from "inquirer";

export const parseArgumentsIntoOptions = (rawArgs) => {
  const args = arg(
    {
      "--yes": Boolean,
      "--tenant": Boolean,
      "-t": "--tenant",
    },
    {
      argv: rawArgs.slice(3),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    tenant: args["--tenant"],
    name: args._[0],
  };
}

export const promptForMissingOptions = async (options) => {
  const defaultName = "entity-name";
  if (options.skipPrompts) {
    return {
      ...options,
      tenant: options.tenant || false,
      name: options.name || defaultName,
    };
  }

  const questions = [];
  if (!options.name) {
    questions.push({
      type: "input",
      name: "name",
      message: "Please write the name of the function",
      default: defaultName,
    });
  }

  if (!options.tenant) {
    questions.push({
      type: "confirm",
      name: "tenant",
      message: "Tenant?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    tenant: options.tenant || answers.tenant,
    name: options.name || answers.name,
  };
}