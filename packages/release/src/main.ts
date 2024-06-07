import { Command } from "commander";
import { releaseAction } from "./action";

const program = new Command();

program
  .name("release")
  .description("Release unplugin-lit-sass")
  .option("--pre", "Release pre-release")
  .option("-l, --level <patch | minor | major | pre>", "release level")
  //.option("-d, --dry-run", "dry run")
  .action(async (options) => {
    releaseAction(options);
  });

program.parse();
