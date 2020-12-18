const {assert, getDriver} = require('vl-ui-core').Test.Setup;
const VlBlueprintPage = require('./pages/vl-blueprint.page');

describe('vl-blueprint', async () => {
  let vlBlueprintPage;

  before(() => {
    vlBlueprintPage = new VlBlueprintPage(getDriver());
    return vlBlueprintPage.load();
  });

  it('', async () => {
    assert.isTrue(true);
  });
});
