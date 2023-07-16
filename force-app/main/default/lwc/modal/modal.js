/*
 * Modal component with standard SLDS markup
 * Author: Yakov Veromeev
 * License: MIT
 */

import { api } from 'lwc';
import { LightningElement } from 'c/lightningElement';
import { generateUUID, isStringFilled } from 'c/utilsString';

export default class Modal extends LightningElement {

    _uuid;

    /**
     * @description UUID to use as id in the markup, important for ARIA describe support
     * @type {string}
     */
    @api set uuid(newUuid) {
        this._uuid = newUuid;
    }
    get uuid() { return this._uuid; }
    /**
     * @type {boolean}
     */
    @api withCloseButton = false;

    /**
     * @type {boolean}
     */
    @api withHeader = false;

    /**
     * @type {boolean}
     */
    @api withHeadingTagline = false;

    /**
     * @type {boolean}
     */
    @api withFooter = false;

    /**
     * @type {boolean}
     */
    @api spinner = false;

    /**
     * @type {boolean}
     */
    _withBody = true;

    /**
     * @type {"small" | "medium" | "large" | null}
     */
    @api size;

    get contentId() {return this._uuid + '-contentId'; }
    get headingId() {return this._uuid + '-headingId'; }
    get closeButtonId() {return this._uuid + '-closeButtonId'; }

    get modalClassList() {
        const sizeClassName = (
            this.size === "small" ? " slds-modal_small" :
            this.size === "medium" ? " slds-modal_medium" :
            this.size === "large" ? " slds-modal_large" :
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
        if (!isStringFilled(this._uuid)) {
            this._uuid = generateUUID();
        }
    }

    handleCloseButtonClick() {
        this.fire("close");
    }

}