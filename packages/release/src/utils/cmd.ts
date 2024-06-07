import { execSync } from "node:child_process";

export const cmd = (command: string) => {
  try {
    return execSync(command, { stdio: "inherit", encoding: "utf8" });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
};
