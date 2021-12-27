import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main"

function parseArgumentsIntoOptions(rawArgs) {
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
      argv: rawArgs.slice(2),
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

async function promptForMissingOptions(options) {
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

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    name: options.name || answers.name,
    cloud: options.cloud || answers.cloud,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}

//AWS o Azure
//add function serverless
//add entity or model