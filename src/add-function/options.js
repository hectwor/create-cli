import arg from "arg";
import inquirer from "inquirer";

export const parseArgumentsIntoOptions = (rawArgs) => {
  const args = arg(
    {
      "--method": String,
      "--yes": Boolean,
      "--authorizer": Boolean,
      "--schema": Boolean,
      "-m": "--method",
      "-y": "--yes",
      "-a": "--authorizer",
      "-s": "--schema",
    },
    {
      argv: rawArgs.slice(3),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    method: args["--method"],
    name: args._[0],
    authorizer: args["--authorizer"],
    schema: args["--schema"],
  };
}

export const promptForMissingOptions = async (options) => {
  const defaultMethod = "POST";
  const defaultName = "function-name";
  if (options.skipPrompts) {
    return {
      ...options,
      method: options.method || defaultMethod,
      name: options.name || defaultName,
      authorizer: options.authorizer || false,
      schema: options.schema || false,
    };
  }

  const questions = [];
  if (!options.method) {
    questions.push({
      type: "list",
      name: "method",
      message: "Please choose the method",
      choices: ["POST", "GET", "PUT", "DELETE", "PATCH"],
      default: defaultMethod,
    });
  }

  if (!options.name) {
    questions.push({
      type: "input",
      name: "name",
      message: "Please write the name of the function",
      default: defaultName,
    });
  }

  if (!options.authorizer) {
    questions.push({
      type: "confirm",
      name: "authorizer",
      message: "Add authorizer?",
      default: false,
    });
  }

  if (!options.schema) {
    questions.push({
      type: "confirm",
      name: "schema",
      message: "Add schema?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    method: options.method || answers.method,
    name: options.name || answers.name,
    authorizer: options.authorizer || answers.authorizer,
    schema: options.schema || answers.schema,
  };
}