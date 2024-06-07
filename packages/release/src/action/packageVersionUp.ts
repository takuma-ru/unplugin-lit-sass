import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import consola from "consola";
import { type ReleaseType, inc } from "semver";
import { PACKAGE_JSON_PATH } from "../constants/config";
import type { ReleaseSchemaType } from "../validation/validation";

export const packageVersionUp = ({ level, pre }: ReleaseSchemaType) => {
  const packageJsonPath = join(__dirname, PACKAGE_JSON_PATH);
  let packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  // const currentVersion = cmd(`npm show ${packageJson.name} version`).trim();
  const currentVersion = "1.0.0-beta.1";

  consola.info(`Current version: ${currentVersion}`);

  const getReleaseType = (): ReleaseType => {
    switch (level) {
      case "patch": {
        if (pre) return "prepatch";
        return "patch";
      }
      case "minor": {
        if (pre) return "preminor";
        return "minor";
      }
      case "major": {
        if (pre) return "premajor";
        return "major";
      }
      case "preup": {
        return "prerelease";
      }
      default: {
        return "patch";
      }
    }
  };
  const newVersion = inc(currentVersion, getReleaseType(), "beta");
  packageJson.version = newVersion;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  consola.info(`New version: ${packageJson.version}`);

  return {
    newVersion: packageJson.version as string,
    packageName: packageJson.name as string,
  };
};
