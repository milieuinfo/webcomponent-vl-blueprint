import { VlElement } from '/node_modules/vl-ui-core/vl-core.js';

(() => {
    loadScript('util.js', '../node_modules/@govflanders/vl-ui-util/dist/js/util.js', () => {
        loadScript('blueprint.js', '../node_modules/@govflanders/vl-ui-blueprint/dist/js/blueprint.js')
    });
  
    function loadScript(id, src, onload) {
        if (!document.head.querySelector('#' + id)) {
            let script = document.createElement('script');
            script.setAttribute('id', id);
            script.setAttribute('src', src);
            script.onload = onload;
            document.head.appendChild(script);
        }
    }
 })();

/**
 * VlBlueprint
 * @class
 * @classdesc 
 * 
 * @extends VlElement
 * 
 * @property 
 * 
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-blueprint/releases/latest|Release notes}
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-blueprint/issues|Issues}
 * @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-blueprint.html|Demo}
 * 
 */
export class VlBlueprint extends VlElement(HTMLElement) {



}

customElements.define('vl-blueprint', VlBlueprint);
