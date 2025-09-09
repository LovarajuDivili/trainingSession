module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",     // new feature
        "fix",      // bug fix
        "docs",     // documentation change
        "style",    // formatting, no code change
        "refactor", // code change (not feature/bug)
        "test",     // adding/updating tests
        "chore",    // tooling, build, ci
        "perf",     // performance improvements
        "build",    // build system, dependencies
        "ci",       // CI/CD config
        "revert",   // revert commit
        "mymsg"     // ✅ your custom type
      ],
    ],
  },
};
