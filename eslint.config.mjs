import { defineConfig } from "eslint/config";
import _import from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";

export default defineConfig([{
    plugins: {
        import: fixupPluginRules(_import),
    },

    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },
    },

    rules: {
        "import/no-named-as-default": "warn",
        "import/no-extraneous-dependencies": "warn",

        "import/no-unresolved": ["error", {
            caseSensitive: true,
        }],
    },
}]);