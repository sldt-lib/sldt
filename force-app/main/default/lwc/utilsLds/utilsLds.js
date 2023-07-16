/*
 * Contains utility methods for retrieving error messages from LDS and Apex errors
 * Author: Yakov Veromeev
 * License: MIT
 */

import { isDefined, isObject } from "c/utilsObject";
import { isString, isStringFilled } from "c/utilsString";
import { isArray } from "c/utilsArray";

/**
 * @typedef {{message?: string}} StringMessageObject
 */

/**
 * @typedef {StringMessageObject[]} ResponseErrorBodyUiApi
 */

/**
 * @typedef {{
 *      pageErrors: StringMessageObject[]
 * }} ResponseErrorBodyPageDmlException
 */
/**
 * @typedef {{
 *      fieldErrors: {
 *          [key: string]: StringMessageObject[]
 *      }
 * }} ResponseErrorBodyFieldDmlException
 */

/**
 * @typedef {StringMessageObject} ApexErrorBody
 */

/**
 * @typedef {{
 *      output: {
 *          errors: StringMessageObject[]
 *      }
 * }} UiApiDmlPageLevelErrorBody
 */
/**
 * @typedef {{
 *      output: {
 *          fieldErrors: {
 *              [fieldName: string]: StringMessageObject[]
 *          }
 *      }
 * }} UiApiDmlFieldLevelErrorBody
 */

/**
 * @typedef {ResponseErrorBodyUiApi|
 *          ResponseErrorBodyPageDmlException|
 *          ResponseErrorBodyFieldDmlException|
 *          ApexErrorBody|
 *          UiApiDmlPageLevelErrorBody|
 *          UiApiDmlFieldLevelErrorBody
 * } ResponseErrorBody
 */

/**
 * @typedef {{statusText: string}} HttpError
 */

/**
 * @typedef {{
 *      body: ResponseErrorBody
 * }|
 * Error|
 * HttpError
 * } ResponseError
 */

/**
 * @description gets message from object if it is a string
 * @param {StringMessageObject} errorObject object containing message
 * @return {string}
 */
const _getObjectMessage = (errorObject) => {
    return ("message" in errorObject && isString(errorObject.message)) ? errorObject.message : "";
}

/**
 * @description get list of messages from one error
 * Officially, ~~stolen~~ copied from LWC recipes
 * @param {ResponseError} error singleError
 * @return {string[]}
 */
const _getSingleErrorMessages = (error) => {
    if (isObject(error) && "body" in error) {

        // UI API read errors
        if (isArray(error.body)) {
            return error.body.map(_getObjectMessage);
        }

        // Page level errors
        else if (
            "pageErrors" in error?.body &&
            isArray(error?.body?.pageErrors)
        ) {
            return error.body.pageErrors.map((e) => e.message);
        }

        // Field level errors
        else if (
            "fieldErrors" in error.body &&
            isObject(error?.body?.fieldErrors) &&
            Object.keys(error.body.fieldErrors).length > 0
        ) {
            const fieldErrors = [];
            Object.values(error.body.fieldErrors).forEach(
                (errorArray) => {
                    fieldErrors.push(
                        ...errorArray.map(_getObjectMessage)
                    );
                }
            );
            return fieldErrors;
        }

        // UI API DML page level errors
        else if (
            "output" in error.body &&
            "errors" in error.body.output &&
            error.body.output.errors &&
            error.body.output.errors.length > 0
        ) {
            return error.body.output.errors.map(_getObjectMessage);
        }

        // UI API DML field level errors
        else if (
            "output" in error.body &&
            "fieldErrors" in error.body.output &&
            error?.body?.output?.fieldErrors &&
            Object.keys(error.body.output.fieldErrors).length > 0
        ) {
            const fieldErrors = [];
            Object.values(error.body.output.fieldErrors).forEach(
                (errorArray) => {
                    fieldErrors.push(
                        ...errorArray.map(_getObjectMessage)
                    );
                }
            );
            return fieldErrors;
        }

        // UI API DML, Apex and network errors
        else if (
            "message" in error.body &&
            isString(error.body.message)) {
            return [error.body.message];
        }
    }

    // JS errors
    else if (error instanceof Error && isString(error.message)) {
        return [error.message];
    }

    // Unknown error shape so try HTTP status text
    else if (isObject(error) && "statusText" in error && error.statusText) {
        return [error.statusText];
    }

    return [JSON.stringify(error)];
}

/**
 * @description gets a single error message
 * @param {ResponseError} error error caught
 * @param {string?} errorSeparator separator in case error has many messages
 */
export const getErrorMessage = (error, errorSeparator = '; ') => {
    return _getSingleErrorMessages(error).join(errorSeparator)
}

/**
 * @description Reduces one or more LDS errors into a string[] of error messages.
 * @param {ResponseError|ResponseError[]} errors
 * @return {String[]} Error messages
 */
export const getErrorMessages = (errors) => {
    if (!isArray(errors)) {
        errors = [errors];
    }

    return (
        errors
            // Remove null/undefined items
            .filter(isDefined)
            // Extract an error message
            .map(_getSingleErrorMessages)
            // Flatten
            .flat()
            // Remove empty strings
            .filter(isStringFilled)
    );
}
