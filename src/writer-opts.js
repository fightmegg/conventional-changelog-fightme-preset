const fs = require("fs/promises");
const path = require("path");
const writerOptsTransform = require("./writer-transform");
const compareFunc = require("compare-func");

module.exports = Promise.all([
  fs.readFile(path.resolve(__dirname, "./templates/template.hbs"), "utf-8"),
  fs.readFile(path.resolve(__dirname, "./templates/header.hbs"), "utf-8"),
  fs.readFile(path.resolve(__dirname, "./templates/commit.hbs"), "utf-8"),
  fs.readFile(path.resolve(__dirname, "./templates/footer.hbs"), "utf-8"),
]).then(([template, header, commit, footer]) => {
  const writerOpts = getWriterOpts();

  writerOpts.mainTemplate = template;
  writerOpts.headerPartial = header;
  writerOpts.commitPartial = commit;
  writerOpts.footerPartial = footer;

  return writerOpts;
});

const getWriterOpts = () => ({
  transform: writerOptsTransform,
  groupBy: "type",
  commitGroupsSort: "title",
  commitsSort: ["scope", "subject"],
  noteGroupsSort: "title",
  notesSort: compareFunc,
});
