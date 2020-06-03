/* eslint-disable no-unused-vars */
const VLBlueprint = require('../components/vl-blueprint');
const {Page, Config} = require('vl-ui-core').Test;

class VLBlueprintPage extends Page {
  async _getBlueprint(selector) {
    return new VlBlueprint(this.driver, selector);
  }

  async load() {
    await super.load(config.baseUrl);
  }
}

module.exports = VLBlueprintPage;
