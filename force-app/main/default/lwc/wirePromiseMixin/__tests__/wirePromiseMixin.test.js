import { WirePromiseMixin } from 'c/wirePromiseMixin';


describe('c-wire-promise-mixin', () => {
    // impossible to construct Lightning Element right there, so use an empty class instead
    class A {}
    class TestClass extends WirePromiseMixin(A) {
        wiredData;
        wiredError;
        // imitation of @wire method
        setWiredData(response) {
            this.setWire("data", response);
        }
        async initRequiredData() {
            try {
                this.wiredData = await this.getWire("data");
            } catch (error) {
                this.wiredError = error;
            }
        }
        async reInitRequiredData() {
            try {
                this.wiredData = undefined;
                this.wiredData = await this.resetWire("data");
            } catch (error) {
                this.wiredError = error;
            }
        }
    }
    describe("set/get wire for apex", () => {

        it("get then set successfully", async () => {
            const testEntry = new TestClass();
            const result = testEntry.initRequiredData();

            await Promise.resolve();
            testEntry.setWiredData({data: {body: "test"}, error: undefined});

            await result;
            expect(testEntry.wiredData).toStrictEqual({body: "test"});
        });
        it("set then get successfully", async () => {
            const testEntry = new TestClass();
            testEntry.setWiredData({data: {body: "test"}, error: undefined});

            await Promise.resolve();
            const result = testEntry.initRequiredData();


            await result;
            expect(testEntry.wiredData).toStrictEqual({body: "test"});
        });

        it("get then set error", async () => {
            const testEntry = new TestClass();
            const result = testEntry.initRequiredData();

            await Promise.resolve();

            testEntry.setWiredData({data: undefined, error: {body: "ERROR"}});

            await result;

            expect(testEntry.wiredError).toStrictEqual({body: "ERROR"});
        })
    });
    describe("set/get wire for other (pageref)", () => {

        it("get then successfully", async () => {
            const testEntry = new TestClass();
            const result = testEntry.initRequiredData();

            await Promise.resolve();
            testEntry.setWiredData({type: "standard__recordPage", attributes: {}});

            await result;
            expect(testEntry.wiredData).toStrictEqual({type: "standard__recordPage", attributes: {}});
        });

    });
    describe("reset get wire for apex", () => {

        it("get, set, then reset successfully", async () => {
            const testEntry = new TestClass();
            const result = testEntry.initRequiredData();

            await Promise.resolve();
            testEntry.setWiredData({data: {body: "test"}, error: undefined});

            await result;
            const result2 = testEntry.reInitRequiredData();

            await Promise.resolve();
            testEntry.setWiredData({data: {body: "test2"}, error: undefined});

            await result2;
            expect(testEntry.wiredData).toStrictEqual({body: "test2"});
        });

        it("reset then get successfully", async () => {
            const testEntry = new TestClass();

            const result2 = testEntry.reInitRequiredData();
            await Promise.resolve();

            testEntry.setWiredData({data: {body: "test2"}, error: undefined});
            await Promise.resolve();


            await result2;
            expect(testEntry.wiredData).toStrictEqual({body: "test2"});
        });

    });
});