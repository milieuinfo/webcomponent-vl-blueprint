/* eslint-disable no-unused-vars */
const {assert, driver} = require('vl-ui-core').Test.Setup;
const VlBlueprintPage = require('./pages/vl-blueprint.page');

describe('vl-blueprint', async () => {
  const vlBlueprintPage = new VlBlueprintPage(driver);

  before(() => {
    return vlBlueprintPage.load();
  });

  it('', async () => {
  });
});
