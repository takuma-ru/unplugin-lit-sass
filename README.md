# unplugin-lit-sass

## Description
`unplugin` to allow `.scss` files to be imported as css variables in lit.

## Getting Started

### 1. Install
```bash
pnpm add unplugin-lit-sass
```

### 2. Configure
<details>
<summary>vite</summary>

`vite.config.ts`
```ts
import { defineConfig } from "vite";
import { unpluginLitSass } from "unplugin-lit-sass";

export default defineConfig({
  plugins: [unpluginLitSass.vite()],
});
```

`src/vite-env.d.ts`
```ts
/// <reference types="unplugin-lit-sass" />
```
</details>

## Usage
### 1. Create SCSS file
Create .scss.
e.g.) `lit-component-name.scss`.

### 2. Import SCSS file from Lit component file
> [!WARNING]
> The path name must end with `?litSass`.
> Giving this query will run the plugin

```ts
import styles from "./lit-component-name.scss?litSass";
// or
import { styles } from "./lit-component-name.scss?litSass";
```

### 3. Apply scss
```ts
import styles from "./my-element.scss?litSass";

@customElement("my-element")
export class MyElement extends LitElement {
  static readonly styles: CSSResultArray = [styles];
  // ...

  render() {
    // ...
  }
}
```

## Options
### `fileType`
#### Description
File type to be processed.
#### Default
```[".scss", ".sass"]```
#### Type
```Array<`.${string}` | `?${string}`>```


### All options
```ts
export type Options = {
  /**
   * File type to be processed.
   *
   * @default [".scss", ".sass"]
   */
  fileType?: Array<`.${string}` | `?${string}`>;
};
```