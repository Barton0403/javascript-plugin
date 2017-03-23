module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "commonjs": true
    },
    "globals": {
      'jQuery': true,
      'module': true,
      'console': true
    },
    "extends": "eslint:recommended",
    "rules": {
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
        "no-console": "off"
    }
};
