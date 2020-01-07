const VLBlueprint = require('../components/vl-blueprint');
const Page = require('./page');
const config = require('../config');

class VLBlueprintPage extends Page {
    async _getBlueprint(selector) {
        return new VlBlueprint(this.driver, selector);
    }

    async load() {
        await super.load(config.baseUrl);
    }
}

module.exports = VLBlueprintPage;
