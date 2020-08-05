import React from 'react';
import { Input, Table } from 'antd';

import { syncQueryHOC } from "sync-query";

import './App.css';
import { columns, mockFetch } from './tableData';

class MyComponent extends React.Component {
  state = {
    searchInput: '',
    pagination: {
      current: 1,
      pageSize: 5,
    },
    loading: false,
    data: [],
  }

  constructor(param) {
    super(param);
    this.fetch = this.fetch.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  // fetch = () => {
  fetch() {
    // ajax request after empty completing
    console.log('fetch...');
    this.setState({ loading: true });
    const { pagination, searchInput } = this.state;
    setTimeout(() => {
      const res = mockFetch({
        pagination,
        search: searchInput,
      });
      this.setState({
        data: res.data,
        pagination: res.pagination,
        loading: false
      });
    }, 500);
  };

  handleTableChange = (pagination) => {
    this.setState({
      pagination,
    })
  };

  render() {
    const { pagination, loading, data } = this.state;
    return (
      <div className="wrapper">
        <div className="operations">
          <Input.Search
            style={{
              width: "200px",
            }}
            defaultValue={this.state.searchInput}
            onChange={(e) => {
              this.setState({
                searchInput: e.target.value,
              });
            }}
            onSearch={(value) => {
              this.setState(
                {
                  searchInput: value,
                },
              );
            }}
            placeholder="input search text"
          />
        </div>
        <br />

        <Table
          className="table"
          columns={columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}          
          onChange={this.handleTableChange}
        />
      </div>
    )
  }
}

const MyComponentEnhance = syncQueryHOC(MyComponent, ['searchInput', 'pagination'], 'fetch');

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <MyComponentEnhance></MyComponentEnhance>
      </div>
    );
  }
}

export default App;
