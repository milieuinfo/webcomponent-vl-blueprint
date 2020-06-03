/* eslint-disable no-unused-vars */
const {assert, driver} = require('vl-ui-core').Test.Setup;
const VLBlueprintPage = require('./pages/vl-blueprint.page');

describe('vl-blueprint', async () => {
  const VLBlueprintPage = new VLBlueprintPage(driver);

  before(() => {
    return VLBlueprintPage.load();
  });

  it('', async () => {
  });
});
