module.exports = {
  preset: "jest-expo",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!(" +
      "@react-native" +
      "|react-native" +
      "|@react-navigation" +
      "|expo" +
      "|expo-modules-core" + // thêm dòng này
      "|@expo" +
      "|unimodules" +
      "|@unimodules" +
      "|@tanstack" +
      "|expo-secure-store" +
      ")/)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
