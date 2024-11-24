/*
 * Copyright 2024 Yakau Verameyeu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { api } from 'lwc';
import { LightningElement, } from 'c/lightningElement';

import { classMap } from 'c/utilsMarkup';

import TEMPLATE_EXPANDABLE from "./sectionExpandable.html";
import TEMPLATE_READONLY from "./sectionReadonly.html";

/**
 * @description Section element to display expandable section
 * Has both declarative api as parameter and methods api: `open`, `close`, `toggle`
 * @see https://www.lightningdesignsystem.com/components/expandable-section/
 */
export default class Section extends LightningElement {

    /**
     * @description By default section is static. Put expandable to have the section title as button that shows/hides content
     * @type {boolean}
     */
    @api expandable = false;

    /**
     * @description Section label, required
     * @requires
     * @type {string}`
     */
    @api label;

    /**
     * @description Use this attribute to control static section state.
     * By default all section are closed so you can put either value or true default to have it initially open.
     * For expandable sections use this attribute to override the open state or have the section open by default
     * @example
     * <sldt-section expandable is-open label="Open but you can close"></sldt-section>
     * <sldt-section is-open label="Static and always open"></sldt-section>
     * <sldt-section is-open={isSectionOpen} label="Static and will open by isSectionOpen value"></sldt-section>
     */
    @api set isOpen(newValue) { this._isOpen = newValue; }
    get isOpen() { return this._isOpen; }

    /**
     * @description Show box border around the section
     * @type {boolean}
     */
    @api boxContent = false;

    /**
     * @description Programmatically open section
     * @example
     * <slds-section lwc:ref="endSection" label="I open at the end"></slds-section>
     * onEndClose() { this.refs.endSection.open(); }
     */
    @api open() {
        this._isOpen = true;
    }

    /**
     * @description Programmatically close section
     * @example
     * <slds-section lwc:ref="additionalDocs" label="AdditionalDocuments"></slds-section>
     * if (!additionalDocsRequired) { this.refs.additionalDocs.close(); }
     */
    @api close() {
        this._isOpen = false;
    }

    /**
     * @description Programmatically toggle section (change the state from open to close or backwards)
     * @returns {boolean}
     */
    @api toggle() {
        this._toggle();
        return this._isOpen;
    }

    /**
     * @description icon name that will be shown in the section title
     * @returns {string}
     */
    get iconName() {
        return this._isOpen ? 'utility:chevrondown' : 'utility:chevronright';
    }

    /**
     * @description By default section is closed
     */
    _isOpen = false;

    get isClosed() {
        return !this._isOpen;
    }

    /**
     * @description Section classes - calculated depending on state of the section
     */
    get sectionClassList() {
        return classMap("slds-section", {
            "slds-is-open": this._isOpen,
            "slds-box": this.boxContent,
        });
    }

    /**
     * @description Returns template basing on if the section is expandable or not
     * @returns {any}
     */
    render() {
        if (this.expandable) {
            return TEMPLATE_EXPANDABLE;
        }
        return TEMPLATE_READONLY;
    }

    /**
     * @description Handles click of the section title button (for expandable ones).
     * Fires `toggle` event with details {isOpen:boolean}
     */
    handleExpandClick() {
        this._toggle();
        this.fire("toggle", {isOpen: this._isOpen});
    }

    /**
     * @description changes the state of the section (open/closed) to another
     */
    _toggle() {
        this._isOpen = !this._isOpen;
    }
}