const VlBlueprint = require('../components/vl-blueprint');
const {Page, Config} = require('vl-ui-core').Test;

class VlBlueprintPage extends Page {
  async _getBlueprint(selector) {
    return new VlBlueprint(this.driver, selector);
  }

  async load() {
    await super.load(Config.baseUrl);
  }
}

module.exports = VlBlueprintPage;
