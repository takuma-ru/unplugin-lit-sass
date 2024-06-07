import { join } from "node:path";
import consola from "consola";
import { z } from "zod";
import { BUILD_CMD, PACKAGE_JSON_PATH } from "../constants/config";
import { cmd } from "../utils/cmd";
import { releaseSchema } from "../validation/validation";
import { packageVersionUp } from "./packageVersionUp";

export const releaseAction = async (options: unknown) => {
  try {
    const { level, pre } = releaseSchema.parse(options);

    const branchName = `release/${new Date()
      .toISOString()
      .replace(/[-:.]/g, "_")}`;
    cmd(`git switch -c ${branchName}`);
    cmd(`git push --set-upstream origin ${branchName}`);

    const { newVersion, packageName } = packageVersionUp({ level, pre });

    // Build the package
    cmd(BUILD_CMD);

    // Commit and push the changes
    cmd(`git add ${join(__dirname, PACKAGE_JSON_PATH)}`);
    cmd(`git commit -m "Release version ${newVersion}"`);
    cmd(`git push origin ${branchName}`);

    // Publish the package
    cmd(`pnpm publish --filter ${packageName} --no-git-checks`);

    // Output the branch name
    // console.log(branchName);
    /**
     * branch_name=$(node release.js major)
     * echo "The release was made on branch: $branch_name"
     */
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.map((error) => {
        consola.error(error.message);
      });
    } else {
      consola.error(error);
    }
  }
};
