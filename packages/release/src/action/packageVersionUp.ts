import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import consola from "consola";
import { type ReleaseType, inc } from "semver";
import type { ReleaseSchemaType } from "../validation/validation";

export const packageVersionUp = ({
  level,
  pre,
  packageJsonPath,
}: ReleaseSchemaType & { packageJsonPath: string }) => {
  const JoinedPackageJsonPath = join(__dirname, packageJsonPath);
  let packageJson = JSON.parse(readFileSync(JoinedPackageJsonPath, "utf8"));

  const currentVersion = execSync(`npm show ${packageJson.name} version`, {
    encoding: "utf8",
  }).trim();

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
  writeFileSync(JoinedPackageJsonPath, JSON.stringify(packageJson, null, 2));
  packageJson = JSON.parse(readFileSync(JoinedPackageJsonPath, "utf8"));

  consola.info(`New version: ${packageJson.version}`);

  return {
    newVersion: packageJson.version as string,
    packageName: packageJson.name as string,
  };
};
