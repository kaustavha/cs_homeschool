module.exports = {
  "env": {
    "es6": true,
    "commonjs": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 9,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "extends": ["airbnb", "prettier","prettier/react"],
  "plugins": [
    "react",
  ],
  "rules": {
    "spaced-comment": 0,
    "no-underscore-dangle": 0,
    "trailing-comma": 0
  }
};
