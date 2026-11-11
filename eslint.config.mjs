import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored component, copied verbatim from 21st.dev — kept unmodified
    // so future updates can be diffed/reapplied as-is.
    "src/components/ui/vapour-text-effect.tsx",
  ]),
]);

export default eslintConfig;
