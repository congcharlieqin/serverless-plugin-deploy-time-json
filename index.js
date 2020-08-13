'use strict';

const fs = require('fs');
const path = require('path');
const { DateTime } = require("luxon");

class DeployTimeOnDeploy {
  get options() {
    const options = Object.assign(
      {
        timeZone: 'utc'
      }, (this.serverless.service.custom &&
      this.serverless.service.custom.deployTime) ||
      {}
    );

    let test_zone = DateTime.local().setZone(options.timeZone);
    if (!test_zone.isValid) {
      this.serverless.cli.log(
        `WARNING: Bad time zone, reason was "${test_zone.invalidReason}", falling back to UTC`
      );
      options.timeZone = 'utc';
    }

    return options;
  }

  constructor(serverless) {
    this.serverless = serverless;
    this.path = serverless.config.servicePath;
    this.deployTimeJSON = 'deploy_time.json';

    this.filePath = path.join(this.path, this.deployTimeJSON);

    this.hooks = {
      'offline:start:init':                      this.writeDeployTimeFile.bind(this),
      'before:deploy:function:deploy':           this.writeDeployTimeFile.bind(this),
      'after:deploy:function:deploy':            this.deleteDeployTimeFile.bind(this),
      'before:deploy:createDeploymentArtifacts': this.writeDeployTimeFile.bind(this),
      'after:deploy:createDeploymentArtifacts':  this.deleteDeployTimeFile.bind(this),
    };
  }

  writeDeployTimeFile() {
    let deployTimeFileContents = '{ "deployTime": " }';

    let timeZone = this.options.timeZone;

    this.serverless.cli.log(`Using timezone "${timeZone}"`);

    const deploy_time = DateTime.local().setZone(timeZone).toISO();
    deployTimeFileContents = `{ "deployTime": "${deploy_time}"}`;

    fs.writeFileSync(this.filePath, deployTimeFileContents);
    this.serverless.cli.log(`Wrote out deploy time with time: ${deploy_time}`);
  }

  deleteDeployTimeFile() {
    fs.unlinkSync(this.filePath);
    this.serverless.cli.log(`Deleted ${this.deployTimeJSON}`);
  }
}

module.exports = DeployTimeOnDeploy;
