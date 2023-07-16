/*
 * Contains utility methods for working with strings
 * Author: Yakov Veromeev
 * License: MIT
 */

import { LightningElement as BaseLightningElement } from 'lwc';
import { isFunction, isObject } from 'c/utilsObject';
import { isStringFilled } from 'c/utilsString';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from "lightning/navigation";

/**
 * @typedef {("success"|"warning"|"info"|"error")} ToastVariant
 */

/** @type {{[key:string]: ToastVariant}} */
const TOAST_VARIANT = {
    SUCCESS: "success",
    WARNING: "warning",
    INFO: "info",
    ERROR: "error",
};


/**
 * @typedef {"dismissible"|"pester"|"sticky"} ToastMode
 */


class LightningElement extends NavigationMixin(BaseLightningElement) {

    /**
     * @description a shortcut for a single element selector in template
     * @param {string} selector query selector
     * @returns {Element?}
     */
    $ = selector => {
        return this.template.querySelector(selector);
    }

    /**
     * @description a shortcut for a multiple element selector in template
     * @param {string} selector query selector
     * @returns {Element[]}
     */
    $$ = selector => {
        return Array.from(this.template.querySelectorAll(selector));
    }

    /**
     * @description a shortcut to fire the custom event. You can fire event by name, by a specific constructor, or pass the event itself
     * @param {string|(new (...args: any[])=> CustomEvent)|CustomEvent} eventName event name if it is a custom event or constructor for specific events or the event itself
     * @param {any} detail detail object for custom events or an argument for custom constructor
     * @param {boolean} bubbles
     * @param {boolean} composed
     * @example
     * ```javascript
     * this.fire("contactUpdate", contactData);
     * this.fire("select", optionValue, true, true);
     * this.fire(RefreshEvent);
     * this.fire(ShowToastEvent, {title, message, variant});
     * this.fire(new ShowToastEvent({title, message, variant}));
     * ```
     */
    fire(eventName, detail, bubbles = false, composed = false) {
        if (isFunction(eventName)) {
            // eventName is constructor
            let event = detail !== undefined ? new eventName(detail) : new eventName();
            this.dispatchEvent(event);
        } else if (isStringFilled(eventName)) {
            this.dispatchEvent(new CustomEvent(eventName, {detail, bubbles, composed}));
        } else if (isObject(eventName)) {
            this.dispatchEvent(eventName);
        }
    }

    /**
     * @description sends success toast
     * @param {string} title toast title
     * @param {string} message toast message
     * @param {?(string|{url: string, label: string})[]} messageData list of values to embed in {X}
     * @param {ToastMode} mode
     */
    toastSuccess(title, message, messageData, mode = "dismissible") {
        this.toast(TOAST_VARIANT.SUCCESS, title, message, messageData, mode);
    }
    /**
     * @description sends warning toast
     * @param {string} title toast title
     * @param {string} message toast message
     * @param {?(string|{url: string, label: string})[]} messageData list of values to embed in {X}
     * @param {ToastMode} mode
     */
    toastWarning(title, message, messageData, mode = "dismissible") {
        this.toast(TOAST_VARIANT.WARNING, title, message, messageData, mode);
    }
    /**
     * @description sends info toast
     * @param {string} title toast title
     * @param {string} message toast message
     * @param {?(string|{url: string, label: string})[]} messageData list of values to embed in {X}
     * @param {ToastMode} mode
     */
    toastInfo(title, message, messageData, mode = "dismissible") {
        this.toast(TOAST_VARIANT.INFO, title, message, messageData, mode);
    }
    /**
     * @description sends error toast
     * @param {string} title toast title
     * @param {string} message toast message
     * @param {?(string|{url: string, label: string})[]} messageData list of values to embed in {X}
     * @param {ToastMode} mode
     */
    toastError(title, message, messageData, mode = "dismissible") {
        this.toast(TOAST_VARIANT.ERROR, title, message, messageData, mode);
    }
    /**
     * @description sends custom toast
     * @param {ToastVariant} variant toast variant, stands for color and meaning of the toast
     * @param {string} title toast title
     * @param {string} message toast message
     * @param {?(string|{url: string, label: string})[]} messageData list of values to embed in {X}
     * @param {ToastMode} mode
     */
    toast(variant, title, message, messageData, mode = "dismissible") {
        this.fire(new ShowToastEvent({variant, title, message, messageData, mode}));
    }

    /**
     * @description Navigates to a page reference
     * @param {{type: string, attributes?:object, state?:object}} pageRef Lightning Page Reference
     */
    navigateTo(pageRef) {
        // @ts-ignore
        this[NavigationMixin.Navigate](pageRef);
    }

    /**
     * @description Generates URL from a page reference, returns a promise
     * @param {{type: string, attributes?:object, state?:object}} pageRef Lightning Page Reference
     * @returns {Promise<string>}
     */
    generateUrl(pageRef) {
        // @ts-ignore
        return this[NavigationMixin.GenerateUrl](pageRef);
    }
}

export { LightningElement };