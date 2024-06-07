import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import { convertScssToCss } from "unplugin-lit-sass-core";

export type Options = {
  /**
   * File type to be processed.
   *
   * @default [".scss", ".sass"]
   */
  fileType?: Array<`.${string}` | `?${string}`>;
};

const CONVERTED_FILE_TYPE = ".lit-sass.js" as const;
const QUERY_PARAM_NAME = "?litSass" as const;

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options
) => {
  const { fileType = [".scss", ".sass"] } = options ?? {};

  return {
    name: "unplugin-lit-sass",

    enforce: "pre",

    resolveId(id, importer) {
      if (
        fileType.some(
          (type) => id.includes(type) && id.endsWith(QUERY_PARAM_NAME)
        )
      ) {
        const newId = id.replace(QUERY_PARAM_NAME, CONVERTED_FILE_TYPE);

        // importerのパスを保存
        if (importer) {
          this.addWatchFile(importer);
        }

        return newId;
      }
    },

    load(id) {
      if (id.endsWith(CONVERTED_FILE_TYPE)) {
        // importerのパスを取得
        const importer = this.getWatchFiles();

        const content = importer
          .map((importer) => {
            // 相対パスを絶対パスに変換
            const absoluteId = resolve(
              dirname(importer),
              id.replace(CONVERTED_FILE_TYPE, "")
            );

            let content: string | undefined;

            try {
              content = readFileSync(absoluteId, "utf-8");
            } catch (error) {
              content = undefined;
            }

            return content;
          })
          .filter((content) => content) as unknown as string[];

        return content[0];
      }
    },

    async transform(code, id) {
      if (id.endsWith(CONVERTED_FILE_TYPE)) {
        const result = await convertScssToCss(code);

        return {
          code: result,
          map: { mappings: "" },
        };
      }
    },
  };
};

export const unpluginLitSass = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unpluginLitSass;

export const unpluginLitSassVite = unpluginLitSass.vite;
export const unpluginLitSassRollup = unpluginLitSass.rollup;
export const unpluginLitSassRolldown = unpluginLitSass.rolldown;
export const unpluginLitSassWebpack = unpluginLitSass.webpack;
export const unpluginLitSassRspack = unpluginLitSass.rspack;
export const unpluginLitSassEsBuild = unpluginLitSass.esbuild;
export const unpluginLitSassFarm = unpluginLitSass.farm;
