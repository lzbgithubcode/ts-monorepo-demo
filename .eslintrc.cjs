module.exports ={
  //设置格式的更目录
  root: true,
  // 可以支持的环境预定义的全局变量 https://eslint.org/docs/latest/user-guide/configuring/language-options#specifying-environments
  env: {
    "browser": true,
    "es6": true,
    "node": true,
   },
   // 扩展配置-继承 https://eslint.org/docs/latest/user-guide/configuring/configuration-files#extending-configuration-files
   extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
  ],
  // 解析器配置
  parser: "@typescript-eslint/parser",
  // 重写规则配置
  overrides: [
  ],
  // 配置选项 https://eslint.org/docs/latest/user-guide/configuring/language-options#specifying-parser-options
  parserOptions: {
      "ecmaVersion": "latest", // 支持es最新的版本
      "sourceType": "module",  // script / module
      "ecmaFeatures":{  // 附加选项
        "jsx": true, // 支持jsx
         "greater": true, // 使用严格模式
         "globalReturn": true, // 全局支持返回return
      }
  },
  // 使用插件
  plugins: [
    "@typescript-eslint"
  ],
  // 规则配置 https://eslint.org/docs/latest/user-guide/configuring/rules
  rules: {
  }
}