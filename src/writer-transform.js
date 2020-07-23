const getCommitType = (commit) => {
  if (commit.revert) return "Reverts";

  switch (commit.type) {
    case "feat":
      return "Features";
    case "fix":
      return "Bug Fixes";
    case "perf":
      return "Performance Improvements";
    case "revert":
      return "Reverts";
    case "docs":
      return "Documentation";
    case "style":
      return "Styles";
    case "refactor":
      return "Code Refactoring";
    case "test":
      return "Tests";
    case "build":
      return "Build System";
    case "ci":
      return "Continuous Integration";
    case "chore":
      return "Chores";
    default:
      return;
  }
};

module.exports = (commit, context) => {
  const issues = [];

  commit.notes.forEach((note) => {
    note.title = "BREAKING CHANGES";
  });

  commit.type = getCommitType(commit);
  if (!commit.type) return;

  if (commit.scope === "*") commit.scope = "";

  if (typeof commit.hash === "string")
    commit.shortHash = commit.hash.substring(0, 7);

  if (typeof commit.subject === "string") {
    let url = context.repository
      ? `${context.host}/${context.owner}/${context.repository}`
      : context.repoUrl;

    if (url) {
      url = `${url}/issues/`;
      // Issue URLs.
      commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
        issues.push(issue);
        return `[#${issue}](${url}${issue})`;
      });
    }

    if (context.host) {
      // User URLs.
      commit.subject = commit.subject.replace(
        /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
        (_, username) => {
          if (username.includes("/")) {
            return `@${username}`;
          }

          return `[@${username}](${context.host}/${username})`;
        }
      );
    }

    // remove references that already appear in the subject
    commit.references = commit.references.filter(
      (reference) => issues.indexOf(reference.issue) === -1
    );

    return commit;
  }
};
