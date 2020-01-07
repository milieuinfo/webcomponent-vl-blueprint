
const { assert, driver } = require('./test');
const VLBlueprintPage = require('./pages/vl-blueprint.page');

describe('vl-blueprint', async () => {
    const VLBlueprintPage = new VLBlueprintPage(driver);

    before(() => {
        return VLBlueprintPage.load();
    });

    it('', async () => {
    });

    after(() => driver && driver.quit());
});
