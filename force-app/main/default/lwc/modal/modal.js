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

/*
 * Modal component with standard SLDS markup
 */

import { api } from 'lwc';
import { LightningElement, } from 'c/lightningElement';

import { isStringFilled, } from 'c/utilsString';
import { isNumber, } from 'c/utilsObject';

/**
 * @description an offset between z indexes of the modals. one for the modal backdrop, one for modal content and one additional.
 * So that modal 1 gets 9000 for backdrop and 9001 for content. Second will get 9003 and 9004 respectively.
 */
const Z_INDEX_OFFSET = 3;

export default class Modal extends LightningElement {

    /**
     * @description a common value to get each modal z index from
     */
    static lastStyleZIndexValue = 9000;

    /**
     * @description The z-index of the modal backdrop. The modal container gets z index = _zIndex + 1
     * Each modal will get its own z index in order to overlay each other and not collapse the markup
     * @type {number}
     */
    _zIndex

    /**
     * @description Shows a white X-cross button in the top-right corner outside of the modal.
     * Generates `close` notification on clicked
     * @type {boolean}
     */
    @api withCloseButton = false;

    /**
     * @description Shows modal header to pass the header content through `header` slot
     * @type {boolean}
     */
    @api withHeader = false;

    /**
     * @description Modal heading text.
     * You can put there text directly in case it is a simple text, not a complex markup.
     * If you use this, setting `withHeader` is unnecessary.
     * @type {string}
     */
    @api heading;

    /**
     * @description Shows modal tag line - a small text below the modal heading.
     * Set this flag to pass the markup there through `header-tagline` slot
     * @type {boolean}
     */
    @api withHeadingTagline = false;

    /**
     * @description modal heading tagline text - a small text below the modal heading.
     * You can put there a text or a rich text.
     * If you pass the value there, the heading tagline is shown automatically,
     * you don't need to set `withHeadingTagline` flag
     */
    @api headingTagline;

    /**
     * @description Shows footer. You can pass there markup using `footer` slot
     * @type {boolean}
     */
    @api withFooter = false;

    /**
     * @description Show a spinner above the whole modal to block the content from interaction in loading/processing phases
     * @type {boolean}
     */
    @api spinner = false;

    /**
     * @description internal boolean to check if modal needs a body. Impacted by `withBody` and `withoutBody` attributes
     * @type {boolean}
     */
    _withBody = true;

    /**
     * @description Modal width. Default is small
     * @type {"small" | "medium" | "large" | "full" | null}
     */
    @api size;

    /**
     * @description returns true if a normal heading should display
     */
    get displayHeader() {
        return this.withHeader || isStringFilled(this.heading);
    }

    /**
     * @description returns true if heading tag line is passed from attribute or slot
     */
    get displayHeadingTagline() {
        return this.withHeadingTagline || isStringFilled(this.headingTagline);
    }

    /**
     * @description additional style in case header is custom. In this case it should not hold internal padding
     */
    get additionalHeaderStyleModification() {
        if (this.withHeader && !isStringFilled(this.heading)) {
            return `padding: 0;`;
        }
        return "";
    }

    get backdropStyleModification() {
        return isNumber(this._zIndex) ? `z-index: ${this._zIndex}` : "";
    }
    get modalContainerStyleModification() {
        return isNumber(this._zIndex) ? `z-index: ${this._zIndex+1}` : "";
    }

    get modalClassList() {
        const sizeClassName = (
            this.size === "small" ? " slds-modal_small" :
            this.size === "medium" ? " slds-modal_medium" :
            this.size === "large" ? " slds-modal_large" :
            this.size === "full" ? " slds-modal_full" :
            ""
        );
        return "slds-modal slds-fade-in-open" + sizeClassName;
    }

    /**
     * @description Flag to explicitly manage if the body part should exist. Do not use with `withoutBody` at the same time.
     * @example
     * ```html
     * <!--"test" will be in the body - it is rendered by default-->
     * <c-modal>test</c-modal>
     * ```
     * @example
     * ```html
     * <!--the body will be rendered only when needToShowBody is true-->
     * <c-modal with-body={needToShowBody}>
     *   <span slot="header">Hello!</span>
     * </c-modal>
     * ```
     * @param {boolean} newWithBodyValue the flag value
     */
    @api set withBody(newWithBodyValue) {
        if (newWithBodyValue !== undefined) {
            this._withBody = !!newWithBodyValue;
        }
    }
    get withBody() {
        return this._withBody;
    }

    /**
     * @description Flag to explicitly manage if the body part should not exist. Do not use with `withBody` at the same time.
     * @example
     * ```html
     * <!--the body will not be rendered because you need only a header to show the warning-->
     * <c-modal without-body>
     *   <span slot="header">WARNING: YOU ARE GOING TO DELETE AN ACCOUNT!</span>
     * </c-modal>
     * ```
     * @type {boolean}
     */
    @api set withoutBody(newWithoutBodyValue) {
        if (newWithoutBodyValue !== undefined) {
            this._withBody = !newWithoutBodyValue;
        }
    }
    get withoutBody() {
        return !this._withBody;
    }

    connectedCallback() {
        this._zIndex = Modal.lastStyleZIndexValue;
        Modal.lastStyleZIndexValue = Modal.lastStyleZIndexValue + Z_INDEX_OFFSET;
    }

    disconnectedCallback() {
        if (this._zIndex + Z_INDEX_OFFSET === Modal.lastStyleZIndexValue) {
            Modal.lastStyleZIndexValue = Modal.lastStyleZIndexValue - Z_INDEX_OFFSET;
        }
    }

    handleCloseButtonClick() {
        this.fire("close");
    }
}