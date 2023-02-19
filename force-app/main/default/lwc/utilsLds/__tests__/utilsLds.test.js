import { getErrorMessage, getErrorMessages } from "c/utilsLds";

const uiApiReadError = {
    body: [
        {message: 'err1'}
    ]
};

const pageError = {
    body: {
        pageErrors: [
            {message: 'err2'},
            {message: 'err3'}
        ]
    }
};

const fieldError = {
    body: {
        fieldErrors: {
            'Name': [
                {message: 'err4'},
                {message: 'err5'},
                {},
            ]
        }
    }
}

const dmlPageLevelErrors = {
    body: {
        output: {
            errors: [
                {message: 'err7'}
            ]
        }
    }
};

const dmlFieldLevelErrors = {
    body: {
        output: {
            fieldErrors: {
                'Amount': [
                    {message: 'err8'}
                ]
            }
        }
    }
};

const apexError = {
    body: {
        message: "err9"
    }
};

const httpError = {
    statusText: 'Not Found'
};

describe("utils-lds", () => {
    describe('getErrorMessage - show error message from error', () => {
        it('getErrorMessage - check get error message from UI API', () => {
            expect(getErrorMessage(uiApiReadError)).toStrictEqual('err1');
        });
        it('getErrorMessage - check get error message from UI page error', () => {
            expect(getErrorMessage(pageError)).toStrictEqual('err2; err3');
        });
        it('getErrorMessage - check get error message from UI field error', () => {
            expect(getErrorMessage(fieldError, '==')).toStrictEqual('err4==err5==');
        });
        it('getErrorMessage - check ger error message from ui dml page error', () => {
            expect(getErrorMessage(dmlPageLevelErrors)).toStrictEqual('err7');
        });
        it('getErrorMessage - check ger error message from ui dml field error', () => {
            expect(getErrorMessage(dmlFieldLevelErrors)).toStrictEqual('err8');
        });
        it('getErrorMessage - check ger error message from apex error', () => {
            expect(getErrorMessage(apexError)).toStrictEqual('err9');
        });
        it('getErrorMessage - check ger error message from JS error', () => {
            let jsError;
            try {
                throw new Error('err10');
            } catch (error) {
                jsError = error;
            }
            expect(getErrorMessage(jsError)).toStrictEqual('err10');
        });
        it('getErrorMessage - check ger error message from http', () => {
            expect(getErrorMessage(httpError)).toStrictEqual('Not Found');
        });
        it('getErrorMessage - check ger error message from unknown', () => {
            // @ts-ignore - test behavior of unexpected type
            expect(getErrorMessage("string error")).toStrictEqual(`"string error"`);
        });
    })
    describe('getErrorMessages - show error message from error', () => {
        it('getErrorMessages - check get error message from UI API', () => {
            expect(getErrorMessages([uiApiReadError])).toStrictEqual(['err1']);
        });
        it('getErrorMessages - check get error message from UI page error', () => {
            expect(getErrorMessages(pageError)).toStrictEqual(['err2','err3']);
        });
        it('getErrorMessages - check get error message from UI field error', () => {
            expect(getErrorMessages(fieldError)).toStrictEqual(['err4','err5']);
        });
        it('getErrorMessages - check ger error message from ui dml page error', () => {
            expect(getErrorMessages(dmlPageLevelErrors)).toStrictEqual(['err7']);
        });
        it('getErrorMessages - check ger error message from ui dml field error', () => {
            expect(getErrorMessages(dmlFieldLevelErrors)).toStrictEqual(['err8']);
        });
        it('getErrorMessages - check ger error message from apex error', () => {
            expect(getErrorMessages(apexError)).toStrictEqual(['err9']);
        });
        it('getErrorMessages - check ger error message from JS error', () => {
            let jsError;
            try {
                throw new Error('err10');
            } catch (error) {
                jsError = error;
            }
            expect(getErrorMessages(jsError)).toStrictEqual(['err10']);
        });
        it('getErrorMessages - check ger error message from http', () => {
            expect(getErrorMessages(httpError)).toStrictEqual(['Not Found']);
        });
        it('getErrorMessages - check ger error message from unknown', () => {
            // @ts-ignore - test behavior of unexpected type
            expect(getErrorMessages("string error")).toStrictEqual([`"string error"`]);
        });
    });
})