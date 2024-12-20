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

import { isDefined } from "c/utilsObject";

/**
 * @typedef {{
 *      resolveFunction: function,
 *      rejectFunction: function,
 *      resultPromise: Promise<any>,
 *      response?: any,
 * }} WireHelperInternalStruct
 */

/**
 * @typedef {{[key:string]: WireHelperInternalStruct}} WireHelperInternalStorage
 */

/**
 * @typedef {{
 *      setWire: (name: string, response: any) => void,
 *      getWire: (name: string) => Promise<any>,
 *      resetWire: (name: string) => Promise<any>,
 *      __initWire: (name: string) => void,
 *      __promiseDataByName: WireHelperInternalStorage,
 * }} WireMixinFunctions
 */

/**
 * @template {{new (...args: any[]): any}} T
 * @description adds setWire, getWire and resetWire to your class to use direct usage of cached data in promises and async/await
 * @param {T} BaseClass class to extend
 * @returns {{new (...args: any[]): WireMixinFunctions} & T}
 */
export const WirePromiseMixin = (BaseClass) => {

    return class WireMixinFunctions extends BaseClass {

        /**
         * @type {WireHelperInternalStorage}
         */
        __promiseDataByName = {};

        /**
         * @description Lazy initialize promise data for the name given. Does not reset if exists
         * @param {string} name wire name to initialize
         */
        __initWire(name) {
            if (!isDefined(this.__promiseDataByName[name])) {
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

        /**
         * @description Fills in the response and calls `resolve` or `reject` function.
         * Checks if the response has data and error (normal wire) or just data (errorless wire)
         * @param {string} name response name to set
         * @param {any} response response set
         */
        setWire(name, response) {
            if (this.__promiseDataByName[name] && this.__promiseDataByName[name].response) {
                // if a wire data was already defined, reset the promise and call wireResetCallback
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

        /**
         * @description Returns the response promise to put the callbacks on
         * @param {string} name response name
         * @returns {any}
         */
        getWire(name) {
            this.__initWire(name);
            return this.__promiseDataByName[name].resultPromise;
        }

        /**
         * @description Resets the promise and returns the promise to run on the next response
         * @param {string} name promise name to reset
         * @returns {Promise<any>} new promise that will be set on the new wire
         */
        resetWire(name) {
            this.__promiseDataByName[name] = undefined;
            this.__initWire(name);
            return this.getWire(name);
        }
    }
}