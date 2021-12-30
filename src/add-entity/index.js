import { parseArgumentsIntoOptions, promptForMissingOptions } from "./options";

export default async (args) => {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  console.log(options);
}