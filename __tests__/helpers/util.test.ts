import { pick, debounce } from "../../src/helpers/util";

test('pick', () => {
    const src = {
        a: 1,
        b: 2
    };
    const picked:any = pick(src, ['a']);
    console.log(picked);
    expect(picked.a).toBe(1);
    expect(picked.b).toBe(undefined);
});

jest.useFakeTimers();

test('debounce', () => {
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
