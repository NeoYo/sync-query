export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

export const RAW_DATA = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Jim Green',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
  { 
    key: '5',	
    name: 'Markos	Paszek',
    age: 55,
    address: 'Pakistan'
  },
  { 
    key: '6',	
    name: 'Kaleb	Wong',
    age: 66,
    address: 'Austria'
  },
  { 
    key: '7',	
    name: 'sync-query',
    age: 5,
    address: 'Welcome to use sync-query!!!'
  },
  { 
    key: '8',	
    name: 'Flore	Einchcombe',
    age: 88,
    address: 'Zambia'
  },
  { 
    key: '9',	
    name: 'Averil	Burkinshaw',
    age: 95,
    address: 'Russia'
  },
  { 
    key: '10',	
    name: 'Bonnie	Prantoni',
    age: 10,
    address: '	Indonesia'
  },
  { 
    key: '11',	
    name: 'Evy	Boutellier',
    age: 11,
    address: '	Philippines'
  },
  { 
    key: '12',	
    name: 'Shelley	Bridge',
    age: 21,
    address: 'Faso	Burkina'
  },
  { 
    key: '13',	
    name: 'Merridie	Prynne',
    age: 31,
    address: '	Sweden'
  },
  { 
    key: '14',	
    name: 'Henrik	Eastcourt',
    age: 2,
    address: 'sync-query demo of antd'
  },
  { 
    key: '15',	
    name: 'Dolly	MacGiolla',
    age: 0,
    address: 'a demo in sync-query'
  },
  { 
    key: '16',	
    name: 'Alfred	Hayne',
    age: 61,
    address: 'Russia'
  },
  { 
    key: '17',	
    name: 'Cassandra	Spens',
    age: 71,
    address: 'Republic	Dominican'
  },
  { 
    key: '18',	
    name: 'Bevan	Danielsson',
    age: 81,
    address: '	Sweden'
  },
  { 
    key: '19',	
    name: 'Linell	Hundey',
    age: 91,
    address: '	China'
  },
  { 
    key: '20',	
    name: 'Sergei	Glaister',
    age: 20,
    address: 'Republic	Czech'
  },
  { 
    key: '21',	
    name: 'Durand	Averill',
    age: 21,
    address: '	Indonesia'
  },
  { 
    key: '22',	
    name: 'Penn	Leatherland',
    age: 18,
    address: '	Brazil'
  },
  { 
    key: '23',	
    name: 'Berti	Windibank',
    age: 22,
    address: '	Russia'
  },
];

export const mockFetch = ({
  pagination,
  search,
}) => {
  const { current, pageSize } = pagination;
  const begin = pageSize * (current - 1);
  let FILTER_DATA = RAW_DATA;
  let data = [];

  if (typeof search === 'string' && search.length > 0) {
    FILTER_DATA = RAW_DATA.filter(person => (
      person.name.indexOf(search) !== -1 || person.address.indexOf(search) !== -1
    ));
  }

  let guard = pageSize;
  while (guard--) {
    const cursor = begin + pageSize - 1 - guard;
    if (cursor >= FILTER_DATA.length) {
      break;
    }
    FILTER_DATA[cursor] && data.push(FILTER_DATA[cursor]);
  }

  return {
    data,
    pagination: {
      current,
      pageSize,
      total: FILTER_DATA.length,
    }
  };
}
