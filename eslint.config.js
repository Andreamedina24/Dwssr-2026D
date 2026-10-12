import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
 
export default defineConfig([
  //1)ignora losn build de front
  {
    ignores:[
      "dist/**",//ignora carpeta de dist
      "node_modules/**"
    ]
  },
  //2)config del back-end
  { files: ["server/**/*.{js,mjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      ecmaVersion:"latest",
      sourceType:"module",
      globals: {
      ...globals.node}
  }
},
//2.1)config del back-end
  { files: ["vite.config.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      ecmaVersion:"latest",
      sourceType:"module",
      globals: {
      ...globals.node}
  }
},
  //3)config del Front-end
  {
    files: ["src/**/*.{js,mjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions:{
      ecmaVersion:"latest",
      sourceType:"module",
      globals: {
      ...globals.browser
    }
  }
},
  //4)Opcional si hay js en public
  {
    files: ["public/**/*.{js,mjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions:{
      ecmaVersion:"latest",
      sourceType:"module",
      globals: {
      ...globals.browser
    }
  }
},
]);