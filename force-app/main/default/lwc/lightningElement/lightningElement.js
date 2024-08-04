/*
 * Copyright 2024 Yakay Verameyeu
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


export class LightningElement extends NavigationMixin(BaseLightningElement) {

    /**
     * @description a shortcut for a single element selector in template
     * @param {string} selector query selector
     * @returns {Element?}
     */
    $(selector) {
        return this.template.querySelector(selector);
    }

    /**
     * @description a shortcut for a multiple element selector in template
     * @param {string} selector query selector
     * @returns {Element[]}
     */
    $$(selector) {
        return Array.from(this.template.querySelectorAll(selector));
    }

    /**
     * @description a shortcut for a single element selector in slots
     * @param {string} selector query selector
     * @returns {Element?}
     */
    slot$(selector) {
        return this.querySelector(selector);
    }

    /**
     * @description a shortcut for a multiple element selector in slots
     * @param {string} selector query selector
     * @returns {Element[]}
     */
    slot$$(selector) {
        return Array.from(this.querySelectorAll(selector));
    }


    /**
     * Proxy handler for `@api` get/setters. Reduces boilerplate of internal property value bypass
     * Use it within the setter with a single argument of a new value to assign the value to internal variable
     * Use it within the getter with 0 arguments to get a stored internally value
     * The internal value field is named the same way as public one with underscore prefix
     * @param  {...any} args arguments. If one is passed, method works from setter
     * @returns any
     * @example
     * ```javascript
     * // internal prop is _recordId
     * set recordId(value) { this.api(value); this.doPostAssignLogic(); }
     * get recordId() { console.log(this.api()); return this.api(); }
     * ```
     */
    api(...args) {
        const isSet = (args.length === 1);
        const stackTraceLinePrefix = isSet ? "set " : "get ";
        let propName = (new Error().stack)
            .split("\n")
            .find((line) => (line.indexOf(stackTraceLinePrefix) === 0));
        propName = (
            "_" +
            propName.substring(0, propName.indexOf("@"))
        );
        if (isSet) {
            this[propName] = args[0];
        } else {
            return this[propName];
        }
    }

    /**
     * @description a shortcut to fire the custom event. You can fire event by name, by a specific constructor, or pass the event itself
     * @param {string|(new (...args: any[])=> CustomEvent)|CustomEvent|Event} eventName event name if it is a custom event or constructor for specific events or the event itself
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
    fire(eventName, detail = null, bubbles = false, composed = false) {
        if (isFunction(eventName)) {
            // eventName is constructor
            // usually when SF uses their custom events (toast, flows), they have a single setting param
            // the same behavior is expected from the events passed to fire method with constructor
            let event = new eventName(detail);
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