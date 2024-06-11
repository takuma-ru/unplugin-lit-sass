import {
  type ExecSyncOptionsWithStringEncoding,
  execSync,
} from "node:child_process";
import { consola } from "consola";

type Cmd = (
  command: string,
  options?: {
    execOptions?: ExecSyncOptionsWithStringEncoding;
    successCallback?: (stdout: string) => string;
    errorCallback?: (error: NodeJS.ErrnoException) => string;
  }
) => string;

export const cmd: Cmd = (command, options) => {
  const { execOptions, successCallback, errorCallback } = options ?? {};
  const { stdio = "inherit", encoding = "utf8" } = execOptions ?? {};

  try {
    const stdout = execSync(command, { stdio, encoding, ...execOptions });

    if (successCallback) {
      return successCallback(stdout);
    }

    return stdout;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;

    consola.error(err.code ?? "", err.message);

    if (errorCallback) {
      return errorCallback(err);
    }

    process.exit(1);
  }
};
