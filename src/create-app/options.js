import arg from "arg";
import inquirer from "inquirer";

export const parseArgumentsIntoOptions = (rawArgs) => {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--template": String,
      "--cloud": String,
      "--install": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
      "-t": "--template",
      "-c": "--cloud",
    },
    {
      argv: rawArgs.slice(3),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    name: args._[0],
    template: args["--template"],
    cloud: args["--cloud"],
    runInstall: args["--install"] || false,
  };
}

export const promptForMissingOptions = async (options) => {
  const defaultTemplate = "TypeScript";
  const defaultName = "template-name";
  const defaultCloud = "AWS";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
      name: options.name || defaultName,
      cloud: options.cloud || defaultCloud,
      git: options.git || false,
      runInstall: options.runInstall || false,
    };
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["TypeScript", "JavaScript"],
      default: defaultTemplate,
    });
  }

  if (!options.name) {
    questions.push({
      type: "input",
      name: "name",
      message: "Please write the name of the project",
      default: defaultName,
    });
  }

  if (!options.cloud) {
    questions.push({
      type: "list",
      name: "cloud",
      message: "Please choose which cloud template to use",
      choices: ["AWS", "AZURE"],
      default: defaultCloud,
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: false,
    });
  }

  if (!options.runInstall) {
    questions.push({
      type: "confirm",
      name: "runInstall",
      message: "Install dependencies?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    name: options.name || answers.name,
    cloud: options.cloud || answers.cloud,
    runInstall: options.runInstall || answers.runInstall,
  };
}