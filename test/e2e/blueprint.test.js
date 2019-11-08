
const { assert, driver } = require('./test');
const VLBulueprintPage = require('./pages/vl-blueprint.page');

describe('vl-blueprint', async () => {
    const VLBulueprintPage = new VLBlueprintPage(driver);

    before(() => {
        return VLBulueprintPage.load();
    });

    it('', async () => {
    });

    after(() => driver && driver.quit());
});
