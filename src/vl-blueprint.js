import {vlElement, define} from '/node_modules/vl-ui-core/dist/vl-core.js';

/**
 * VlBlueprint
 * @class
 * @classdesc @description@
 *
 * @extends HTMLElement
 *
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-blueprint/releases/latest|Release notes}
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-blueprint/issues|Issues}
 * @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-blueprint.html|Demo}
 *
 */
export class VlBlueprint extends vlElement(HTMLElement) {}

define('vl-blueprint', VlBlueprint);
