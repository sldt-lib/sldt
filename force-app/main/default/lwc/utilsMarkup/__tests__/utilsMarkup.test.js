import {classMap} from 'c/utilsMarkup';

describe('c-utils-markup', () => {
    it("classMap - compose classes from a map", () => {
        let cl1 = false;
        let cl2 = false;
        let cl3 = false;

        expect(classMap({})).toStrictEqual("");

        expect(classMap({"class-1": cl1, "class-2": cl2, "class-3": cl3})).toStrictEqual("");

        cl1 = true;
        expect(classMap({"class-1": cl1, "class-2": cl2, "class-3": cl3})).toStrictEqual("class-1");

        cl2 = true;
        expect(classMap({"class-1": cl1, "class-2": cl2, "class-3": cl3})).toStrictEqual("class-1 class-2");

        cl2 = false;
        cl3 = true;
        expect(classMap({"class-1": cl1, "class-2": cl2, "class-3": cl3})).toStrictEqual("class-1 class-3");

        cl2 = true;
        expect(classMap({"class-1": cl1, "class-2": cl2, "class-3": cl3})).toStrictEqual("class-1 class-2 class-3");
    });

    it("classMap - compose classes from a static class + map", () => {
        let cl1 = false;
        let cl2 = false;
        let cl3 = false;

        expect(classMap("static-class")).toStrictEqual("static-class");

        expect(classMap("static-class", {"class-1": cl1, "class-2": cl2, "class-3": cl3})).toStrictEqual("static-class");

        cl1 = true;
        expect(classMap("static-class", {"class-1": cl1, "class-2": cl2, "class-3": cl3})).toStrictEqual("class-1 static-class");

        cl2 = true;
        expect(classMap("static-class", {"class-1": cl1, "class-2": cl2, "class-3": cl3})).toStrictEqual("class-1 class-2 static-class");

        cl2 = false;
        cl3 = true;
        expect(classMap("static-class", {"class-1": cl1, "class-2": cl2, "class-3": cl3})).toStrictEqual("class-1 class-3 static-class");

        cl2 = true;
        expect(classMap("static-class", {"class-1": cl1, "class-2": cl2, "class-3": cl3})).toStrictEqual("class-1 class-2 class-3 static-class");
    });
});