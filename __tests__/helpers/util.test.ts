import { pick, debounce, filter, map } from "../../src/helpers/util";
import { deepEqual } from "../../src/helpers/deepEqual";

test('pick', () => {
    const src = {
        a: 1,
        b: 2
    };
    const picked:any = pick(src, ['a']);
    expect(picked.a).toBe(1);
    expect(picked.b).toBe(undefined);
});

test('filter', () => {
    const originError = console.error;
    console.error = jest.fn()
    expect(filter([])).toStrictEqual({});
    expect(console.error).toHaveBeenCalled();
    const obj = {
        a: 1,
        b: 2,
        c: null,
        d: '',
        e: 0,
        f: false,
    }; 
    expect(filter(obj)).toStrictEqual({
        a: 1,
        b: 2,
        d: '',
        e: 0,
        f: false,
    });
    expect(filter(obj, (newObj, key, obj) => (obj[key]))).toStrictEqual({
        a: 1,
        b: 2,
    });
    console.error = originError;
});

test('map', () => {
    const obj = {
        a: 1,
        b: 2,
        c: null,
        d: '',
        e: 0,
        f: false,
    }; 
    expect(map(obj, (value, key) => (JSON.stringify(value))))
        .toStrictEqual({
            "a": "1",
            "b": "2",
            "c": "null",
            "d": "\"\"",
            "e": "0",
            "f": "false"
        });
    const originError = console.error;
    console.error = jest.fn()
    expect(map([], (value) => (value))).toStrictEqual({});
    expect(console.error).toHaveBeenCalled();
    console.error = originError;
});

/*
test('difference', () => {
    // difference();
    expect(
        difference({
            chTypes: ["CHA", "CHB", "INFORMAL_CHA", "NONE", "CHC"],
            dbEndDate: "2020-07-09",
            dbStartDate: "2020-07-08",
            pagination: {pageSize: 10, total: 0, current: 1},
            reportPublished: "false",
            searchInput: "",
        }, {
            chTypes: ["CHA", "CHB", "INFORMAL_CHA", "NONE", "CHC"],
            dbEndDate: "2020-07-09",
            dbStartDate: "2020-07-08",
            pagination: {pageSize: 10, total: 0, current: 1},
            reportPublished: "false",
            searchInput: "",
        })
    ).toStrictEqual({})

    expect(
        difference({
            chTypes: ["CHB", "INFORMAL_CHA", "NONE"],
        }, {
            chTypes: ["CHA", "CHB", "INFORMAL_CHA", "NONE"],
        })
    ).toStrictEqual({
        chTypes: ["CHB", "INFORMAL_CHA", "NONE"],
    });

    expect(
        difference({
            chTypes: ["ADD", "CHA", "CHB", "INFORMAL_CHA", "NONE"],
        }, {
            chTypes: ["CHA", "CHB", "INFORMAL_CHA", "NONE"],
        })
    ).toStrictEqual({
        chTypes: ["ADD", "CHA", "CHB", "INFORMAL_CHA", "NONE"],
    });


    expect(
        difference({
            pagination: {pageSize: 10, total: 0, current: 1},
        }, {
            pagination: {pageSize: 1, total: 0, current: 1},
        })
    ).toStrictEqual({
        pagination: {pageSize: 10},
    });
});
*/


test('deepEqual', () => {
    expect(
        deepEqual({
            chTypes: ["CHA", "CHB", "INFORMAL_CHA", "NONE", "CHC"],
            dbEndDate: "2020-07-09",
            dbStartDate: "2020-07-08",
            pagination: {pageSize: 10, total: 0, current: 1},
            reportPublished: "false",
            searchInput: "",
        }, {
            chTypes: ["CHA", "CHB", "INFORMAL_CHA", "NONE", "CHC"],
            dbEndDate: "2020-07-09",
            dbStartDate: "2020-07-08",
            pagination: {pageSize: 10, total: 0, current: 1},
            reportPublished: "false",
            searchInput: "",
        })
    ).toStrictEqual(true)

    expect(
        deepEqual({
            chTypes: ["CHB", "INFORMAL_CHA", "NONE"],
        }, {
            chTypes: ["CHA", "CHB", "INFORMAL_CHA", "NONE"],
        })
    ).toStrictEqual(false);

    expect(
        deepEqual({
            chTypes: ["ADD", "CHA", "CHB", "INFORMAL_CHA", "NONE"],
        }, {
            chTypes: ["CHA", "CHB", "INFORMAL_CHA", "NONE"],
        })
    ).toStrictEqual(false);


    expect(
        deepEqual({
            pagination: {pageSize: 10, total: 0, current: 1},
        }, {
            pagination: {pageSize: 1, total: 0, current: 1},
        })
    ).toStrictEqual(false);
});

test('debounce', () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    const debouncedFunc = debounce(callback, 2000);
    // 在这个时间点，定时器的回调不会被执行
    expect(callback).not.toBeCalled();

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    // “快进”时间使得所有定时器回调被执行
    jest.runAllTimers();

    // 现在回调函数应该被调用了！
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
});
