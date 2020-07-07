import { pick } from "../../src/helpers/util";

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
