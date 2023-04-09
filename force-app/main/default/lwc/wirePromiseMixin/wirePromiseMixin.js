// eslint-disable-next-line no-unused-vars
import { LightningElement } from "lwc";

/**
 * @typedef {{
 *      setWire: (name: string, response: any) => void,
 *      getWire: (name: string) => Promise<any>,
 *      resetWire: (name: string) => Promise<any>
 * }} WireMixinFunctions
 */

/**
 * @description adds setWire, getWire and resetWire to your class to use direct usage of cached data in promises and async/await
 * @param {typeof LightningElement} BaseClass class to extend
 * @returns {{new (...args: any[]): WireMixinFunctions} & BaseClass}
 */
export const WirePromiseMixin = (BaseClass) => {
    return class WireMixinFunctions extends BaseClass {
        /**
         * @type {{[name:string]: {
         *      resolveFunction: function,
         *      rejectFunction: function,
         *      resultPromise: Promise<any>,
         *      response: any,
         * }}}
         */
        __promiseDataByName = {};

        __initWire = (name) => {
            if (this.__promiseDataByName[name] === undefined) {
                let resolveFunction;
                let rejectFunction;
                let resultPromise = new Promise((resolve, reject) => {
                    resolveFunction = resolve;
                    rejectFunction = reject;
                })
                this.__promiseDataByName[name] = {
                    resolveFunction,
                    rejectFunction,
                    resultPromise,
                    response: undefined,
                };
            }

        }

        setWire = (name, response) => {
            if (this.__promiseDataByName[name] && this.__promiseDataByName[name].response) {
                this.resetWire(name);
            }
            this.__initWire(name);
            this.__promiseDataByName[name].response = response;
            if (("data" in response) && ("error" in response)) {
                if (response.data !== undefined) {
                    this.__promiseDataByName[name].resolveFunction(response.data);
                } else if (response.error !== undefined) {
                    this.__promiseDataByName[name].rejectFunction(response.error);
                }
            } else {
                this.__promiseDataByName[name].resolveFunction(response);
            }
        }

        getWire = (name) => {
            this.__initWire(name);
            return this.__promiseDataByName[name].resultPromise;
        }

        resetWire = (name) => {
            this.__initWire(name);
            return this.getWire(name);
        }
    }
}