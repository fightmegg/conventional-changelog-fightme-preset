const conventionalChangelogCore = require("conventional-changelog-core");
const through = require("through2");
const { execSync } = require("child_process");
const fightmePreset = require("../index");

const dummyCommit = (msg, opts) => {
  let args = "";
  if (Array.isArray(msg)) msg.forEach((m) => (args += `-m "${m}" `));
  else args += `-m "${msg}"`;

  execSync(`git commit ${args} --allow-empty --no-gpg-sign`, {
    cwd: `${__dirname}/tmp/git-templates`,
  });
};

describe("FightMe Preset", () => {
  beforeEach(() => {
    execSync(`rm -rf ${__dirname}/tmp`);
    execSync(`mkdir -p ${__dirname}/tmp/git-templates`);
    execSync(`git init --template=./git-templates`, {
      cwd: `${__dirname}/tmp`,
    });

    execSync('git config user.name "fightme"', {
      cwd: `${__dirname}/tmp/git-templates`,
    });
    execSync('git config user.email "fightme@circleci.com"', {
      cwd: `${__dirname}/tmp/git-templates`,
    });
  });

  afterAll(() => {
    execSync(`rm -rf ${__dirname}/tmp`);
  });

  test("it should work if no semver tag", (done) => {
    dummyCommit([
      "build: first build setup",
      "BREAKING CHANGE: New build system.",
    ]);
    dummyCommit([
      "ci(travis): add TravisCI pipeline",
      "BREAKING CHANGE: Continuously integrated.",
    ]);
    dummyCommit([
      "feat: amazing new module",
      "BREAKING CHANGE: Not backward compatible.",
    ]);
    dummyCommit([
      "fix(compile): avoid a bug",
      "BREAKING CHANGE: The Change is huge.",
    ]);
    dummyCommit(["perf(ngOptions): make it faster", " closes #1, #2"]);
    dummyCommit("revert(ngOptions): bad commit");
    dummyCommit("fix(*): oops");
    dummyCommit("docs(api): updated API");
    dummyCommit("chore(deps): updated deps");
    dummyCommit("test(api): added api ones");

    const stdout = execSync("git log", {
      cwd: `${__dirname}/tmp/git-templates`,
    });
    console.log(stdout.toString());

    conventionalChangelogCore(
      {
        config: fightmePreset,
        pkg: {
          path: `${__dirname}/tmp/git-templates`,
        },
      },
      {},
      {},
      {},
      {},
      { cwd: `${__dirname}/tmp/git-templates` }
    ).pipe(
      through((chunk) => {
        const output = chunk.toString();

        expect(output).toMatch("first build setup");
        expect(output).toMatch("**travis:** add TravisCI pipeline");
        expect(output).toMatch("**travis:** Continuously integrated.");
        expect(output).toMatch("amazing new module");
        expect(output).toMatch("**compile:** avoid a bug");
        expect(output).toMatch("make it faster");
        expect(output).toMatch(
          ", closes [#1](https://github.com/fightmegg/conventional-changelog-fightme-preset/issues/1) [#2](https://github.com/fightmegg/conventional-changelog-fightme-preset/issues/2)"
        );
        expect(output).toMatch("New build system.");
        expect(output).toMatch("Not backward compatible.");
        expect(output).toMatch("**compile:** The Change is huge.");
        expect(output).toMatch("**api:** updated API");
        expect(output).toMatch("**deps:** updated deps");
        expect(output).toMatch("**api:** added api ones");

        expect(output).toMatch("Build System");
        expect(output).toMatch("Continuous Integration");
        expect(output).toMatch("Features");
        expect(output).toMatch("Bug Fixes");
        expect(output).toMatch("Performance Improvements");
        expect(output).toMatch("Reverts");
        expect(output).toMatch("bad commit");
        expect(output).toMatch("BREAKING CHANGE");
        expect(output).toMatch("Documentation");
        expect(output).toMatch("Chores");
        expect(output).toMatch("Tests");

        expect(output).not.toMatch("ci");
        expect(output).not.toMatch("feat");
        expect(output).not.toMatch("fix");
        expect(output).not.toMatch("perf");
        expect(output).not.toMatch("revert");
        expect(output).not.toMatch("docs");
        expect(output).not.toMatch("chore");
        expect(output).not.toMatch("test");

        done();
      })
    );
  });

  test("should replace @username with GitHub user URL", (done) => {
    dummyCommit("feat(awesome): issue brought up by @bcoe! on Friday");

    conventionalChangelogCore(
      {
        config: fightmePreset,
      },
      {},
      {},
      {},
      {},
      { cwd: `${__dirname}/tmp/git-templates` }
    ).pipe(
      through((chunk) => {
        const output = chunk.toString();
        expect(output).toMatch("[@bcoe](https://github.com/bcoe)");
        done();
      })
    );
  });
});
