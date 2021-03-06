import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import chalk from 'chalk';
import templates from '../templates';
import { parseArgumentsIntoOptions, promptForMissingOptions } from "./options";

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

const downloadFiles = async (options) => {
  await execa("mkdir", [options.name], {
    localDir: options.targetDirectory,
  });
  const result = await execa("git", ["clone", templates[`${options.cloud.toLowerCase()}-${options.template.toLowerCase()}`], "."], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to clone template"));
  }
  await execa("rm", ["-rf", ".git"], {
    cwd: options.targetDirectory,
  });
  return;
};

const initGit = async (options) => {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  return;
}

export default async (args) => {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  options = {
    ...options,
    targetDirectory: `${process.cwd()}/${options.name}`,
  };
/*
  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    "../../templates",
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", chalk.red.bold('ERROR'));
    process.exit(1);
  }*/

  const tasks = new Listr([
    {
      title: "Download template files",
      task: () => downloadFiles(options),
    },
    {
      title: "Initialize git",
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: "Install dependencies",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () =>
        !options.runInstall
          ? "Pass --install to automatically install dependencies"
          : undefined,
    },
  ]);

  await tasks.run();

  console.log("%s Project ready", chalk.green.bold('DONE'));
  return true;
}
