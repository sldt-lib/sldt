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

// eslint-disable-next-line no-unused-vars
import { LightningElement } from "lwc";
import { isDefined } from "c/utilsObject";

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

        setWire = (name, response) => {
            if (this.__promiseDataByName[name] && this.__promiseDataByName[name].response) {
                this.resetWire(name);
            }
            this.__initWire(name);
            this.__promiseDataByName[name].response = response;
            if (("data" in response) && ("error" in response)) {
                if ( response.data !== undefined) {
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
            if (isDefined(this.__promiseDataByName[name])) {
                this.__promiseDataByName[name] = undefined;
            }
            this.__initWire(name);
            return this.getWire(name);
        }
    }
}