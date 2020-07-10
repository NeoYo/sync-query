import { filterQuery } from "../../src/helpers/url";

test('filterQuery', () => {
    const queryString = `pagination=%7B"pageSize"%3A20%2C"total"%3A21%2C"current"%3A1%7D&dbStartDate="2020-05-01"&dbEndDate="2020-07-31"&chTypes=%5B"CHA"%2C"CHB"%2C"INFORMAL_CHA"%2C"NONE"%2C"CHC"%5D&reportPublished="true"&hello=test`;
    const targetList = ['pagination', 'dbStartDate', 'dbEndDate', 'chTypes', 'reportPublished'];
    const restQuery = filterQuery(
        queryString,
        (key, value) => (targetList.indexOf(key) === -1)
    )
    expect(
        restQuery
    ).toBe('hello=test');
})
