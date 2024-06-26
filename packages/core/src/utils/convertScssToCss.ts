import process from "node:process";
import sass from "sass-embedded";

export const convertScssToCss = (scss: string) => {
  const uuid = "id-ca53df94-3349-d4e1-1c1e-168916338c49";

  if (scss.includes(uuid)) {
    return scss;
  }

  const result = sass
    .compileString(scss, {
      style: "compressed",
      loadPaths: [process.cwd()],
    })
    .css.toString();

  return `
// ${uuid}
// This file is auto generated by unplugin-lit-sass
import { css } from "lit";
export const styles = css\`${result}\`;
export default styles;
  `;
};
