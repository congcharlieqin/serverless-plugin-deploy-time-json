# serverless-plugin-deploy-time-json
A serverless plugin that writes out the time of deploy to a simple json file

To set the deploy time you can set a custom variable called deployTime and the timeZone. If it fails to parse the time zone then it will default back to UTC.
```
custom:
  # Our stage is based on what is passed in when running serverless
  # commands. Or falls back to what we have set in the provider section.
  stage: ${opt:stage, self:provider.stage}
  region: ${opt:region, 'us-west-2'}
  resourcesStages:
    prod: prod
    dev: dev
  resourcesStage: ${self:custom.resourcesStages.${self:custom.stage}, self:custom.resourcesStages.dev}
  deployTime:
    timeZone: 'America/Los_Angeles'
```
