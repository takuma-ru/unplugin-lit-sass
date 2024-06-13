import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { convertScssToCss } from "@unplugin-lit-sass/core";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";

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
      const isLitSass = fileType.some(
        (type) => id.includes(type) && id.endsWith(QUERY_PARAM_NAME)
      );

      if (isLitSass) {
        const newId = id.replace(QUERY_PARAM_NAME, CONVERTED_FILE_TYPE);

        if (!importer) {
          return newId;
        }

        return resolve(dirname(importer), newId);
      }
    },

    load(id) {
      if (id.endsWith(CONVERTED_FILE_TYPE)) {
        try {
          const originalId = id.replace(CONVERTED_FILE_TYPE, "");

          this.addWatchFile(originalId);
          return readFileSync(originalId, "utf-8");
        } catch (error) {
          return undefined;
        }
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
