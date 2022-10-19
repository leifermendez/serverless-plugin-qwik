const yaml = require("js-yaml");
const BbPromise = require("bluebird");
const path = require("path");
const fs = BbPromise.promisifyAll(require("fs"));
const PATH_YAML = [
  path.join(process.cwd(), "serverless.yml"),
  path.join(process.cwd(), "..", "serverless.yml"),
  path.join(process.cwd(), "..", "..", "serverless.yml"),
  path.join(process.cwd(), "..", "..", "..", "..", "serverless.yml"),
];

const PATH_YAML_CURRENT = PATH_YAML.findIndex((a) => !!fs.existsSync(a));

const addNewArrayItem = () => {
  const yamlObj = yaml.load(
    fs.readFileSync(PATH_YAML[PATH_YAML_CURRENT], "utf8")
  );
  if (!Object.hasOwn(yamlObj, "plugins")) {
    yamlObj.plugins = [];
  }
  const requireDep = [
    "serverless-plugin-include-dependencies",
    "serverless-plugin-common-excludes",
  ];
  const currentPlugin = yamlObj.plugins || [];

  if (currentPlugin.some((a) => requireDep.includes(a))) {
    return;
  }

  const mergePlugins = [
    ...new Set([
      ...["serverless-plugin-qwik"],
      ...requireDep,
      ...currentPlugin,
    ]),
  ];
  yamlObj.plugins = mergePlugins;

  const uodateYaml = yaml.dump(yamlObj, {});

  return fs.writeFileAsync(PATH_YAML[PATH_YAML_CURRENT], uodateYaml);
};

addNewArrayItem();
