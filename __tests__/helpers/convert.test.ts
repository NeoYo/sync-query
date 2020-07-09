import { queryToState, parseParam, stateToQuery } from "../../src/helpers/convert";

// parseParam
test('parseParam', () => {
    expect(parseParam(null)).toBe(null);
    expect(parseParam(JSON.stringify(true))).toBe(true);
    expect(parseParam(JSON.stringify(1000))).toBe(1000);
    expect(parseParam(JSON.stringify('aaa'))).toBe('aaa');

    expect(parseParam('["CHA","CHB"]')).toStrictEqual(["CHA", "CHB"]);
    expect(parseParam('"2020-05-31"')).toBe("2020-05-31");
    expect(parseParam('"2020-05-01"')).toBe("2020-05-01");
    expect(parseParam('{"pageSize":20,"total":21,"current":1}')).toStrictEqual({
        pageSize: 20,
        total: 21,
        current: 1, 
    });
});

test('queryToState should filter undefined value', () => {
    const state = queryToState(
        'dbSelectType=DAY&dbStartDate=2020-07-07&dbEndDate=2020-07-08&dbStartMonth=2020-01&dbEndMonth=2020-07',
        ['dbSelectType']
    );
    expect(state).toStrictEqual({});
});

test('queryToState should parse query', () => {
    const state = queryToState(
        "dbStartDate=%222020-05-01%22&pagination=%7B%22pageSize%22%3A20%2C%22total%22%3A21%2C%22current%22%3A1%7D&chTypes=%5B%22CHA%22%2C%22CHB%22%5D&reportPublished=false",
        ['pagination', 'dbStartDate', 'chTypes', 'reportPublished']
    );
    expect(state).toStrictEqual({
        dbStartDate: '2020-05-01',
        pagination: {
            "pageSize":20,
            "total":21,
            "current":1
        },
        chTypes: ["CHA", "CHB"],
        reportPublished: false,
    });
});

test('stateToQuery should stringify state', () => {
    const query = stateToQuery({
        dbStartDate: '2020-05-01',
        pagination: {
            "pageSize":20,
            "total":21,
            "current":1
        },
        chTypes: ["CHA", "CHB"],
        reportPublished: false,
    });
    expect(query).toBe("dbStartDate=%222020-05-01%22&pagination=%7B%22pageSize%22%3A20%2C%22total%22%3A21%2C%22current%22%3A1%7D&chTypes=%5B%22CHA%22%2C%22CHB%22%5D&reportPublished=false");
});


