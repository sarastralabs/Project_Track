import globals from "globals";
import { baseConfig } from "./base.js";

/**
 * For Next.js apps (apps/api).
 * Next-specific plugins can be added when the app exists (Step 0.10).
 */
export const nextConfig = [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];

export default nextConfig;
