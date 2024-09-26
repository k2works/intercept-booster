module.exports = {
    preset: "ts-jest",
    moduleFileExtensions: [
        "js",
        "ts",
    ],
    testMatch: [
        "**/src/**/*.test.ts",
        "**/src/**/*.test.tsx"
    ],
    roots: [
        "<rootDir>/src"
    ]
};
