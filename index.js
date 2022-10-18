"use strict";

const path = require("path");
const precinct = require("precinct");
const resolve = require("resolve");
const readPkgUp = require("read-pkg-up");

const PATH_AWS_MSJ = path.join(process.cwd(), "server", "entry.aws-lambda.mjs");

class QwikServerlessPlugin {
  constructor(serverless) {
    this.serverless = serverless;
    this.hooks = {
      initialize: () => this.init(),
    };
  }

  init() {
    let parentDep = [];
    let filterDep = [];

    const { patterns } = this.serverless.package || { patterns: [] };
    parentDep = precinct.paperwork(PATH_AWS_MSJ, { includeCore: false });
    while (parentDep.length) {
      const modulePkgName = parentDep.pop();
      filterDep.push(modulePkgName);
      for (const deepName of this.deep(modulePkgName)) {
        parentDep.push(deepName);
        filterDep.push(deepName);
      }
    }
    const uniqueFilter = [...new Set(filterDep)];
    const arrayDependencies = [...patterns, ...uniqueFilter]
      .flat(3)
      .map((n) => `node_modules/${n}/**`);
    this.serverless.service.package.patterns = [...new Set(arrayDependencies)];
  }

  deep(name) {
    const moduleName = name.replace(/\\/, "/");
    const pathToModule = resolve.sync(path.join(moduleName, "package.json"), {
      basedir: process.cwd() + "/node_modules",
    });
    try {
      const pkg = readPkgUp.sync({ cwd: pathToModule });
      return Object.keys(pkg.packageJson.dependencies) || [];
    } catch (e) {
      return [];
    }
  }
}

module.exports = QwikServerlessPlugin;
