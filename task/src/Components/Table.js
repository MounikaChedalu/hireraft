import React, { useEffect, useState, useRef } from 'react';
import { Table, Input, Button, Space, Checkbox } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const CombinedTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8,
    },
  });
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [showIdColumn, setShowIdColumn] = useState(true);
  const searchInput = useRef(null);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleToggleIdColumn = () => {
    setShowIdColumn(!showIdColumn);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }

    if (sorter.columnKey === 'name') {
      const filteredData = applyFilters(data, filters);
      const sortedData = [...filteredData].sort((a, b) => a.name.first.localeCompare(b.name.first));
      const updatedData = sortedData.map((item, index) => ({ ...item, id: index + 1 }));
      setData(updatedData);
    } else if (sorter.columnKey === 'age') {
      const sortedData = [...data].sort((a, b) => a.age - b.age);
      setData(sortedData);
    }
  };

  const applyFilters = (data, filters) => {
    let filteredData = data;

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value && value.length > 0) {
        filteredData = filteredData.filter((item) => {
          const dataIndexValue = item[key];
          if (key === 'id') {
            return dataIndexValue.toString().toLowerCase().includes(value.toString().toLowerCase());
          }
          if (key === 'name') {
            const fullName = `${dataIndexValue.first} ${dataIndexValue.last}`;
            return fullName.toLowerCase().includes(value.toLowerCase());
          }
          return false;
        });
      }
    });

    return filteredData.map((item, index) => ({ ...item, id: index + 1 }));
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => {
    if (dataIndex === 'name') {
      return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div
            style={{
              padding: 8,
              width: 250,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
  
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({
                    closeDropdown: false,
                  });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                Close
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <Space>
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
          </Space>
        ),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
      };
    }
  
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div
          style={{
            padding: 8,
            width: 250,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Checkbox.Group
            options={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
            value={selectedKeys}
            onChange={(values) => setSelectedKeys(values)}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
  
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              Close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <Space>
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
          <FilterOutlined style={{ color: selectedKeys.length > 0 ? '#1890ff' : undefined }} />
        </Space>
      ),
      onFilter: (value, record) => {
        const dataIndexValue = record[dataIndex];
        if (dataIndex === 'id') {
          return dataIndexValue.toString().toLowerCase().includes(value.toLowerCase());
        }
  
        if (dataIndex === 'gender') {
          return value.includes(dataIndexValue.toLowerCase());
        }
  
        return false;
      },
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    };
  };
  
  const handleSearchButton = () => {
    const filteredData = data.filter((item) => {
      const fullName = `${item.name.first} ${item.name.last}`.toLowerCase();
      return fullName.includes(searchText.toLowerCase());
    });

    setData(filteredData);
  };

  useEffect(() => {
    const hardcodedData = [
      {
        id: 1,
        name: { first: 'Mounika' },
        gender: 'female',
        age: 22,
      },
      {
        id: 2,
        name: { first: 'Supriya' },
        gender: 'female',
        age: 22,
      },
      {
        id: 3,
        name: { first: 'Anvesh' },
        gender: 'male',
        age: 25,
      },
      {
        id: 4,
        name: { first: 'suvarna' },
        gender: 'female',
        age: 38,
      },
      {
        id: 5,
        name: { first: 'Srija' },
        gender: 'female',
        age: 30,
      },
      {
        id: 6,
        name: { first: 'Thriveni' },
        gender: 'female',
        age: 33,
      },
      {
        id: 7,
        name: { first: 'Sneha' },
        gender: 'female',
        age: 20,
      },
      {
        id: 8,
        name: { first: 'krishna' },
        gender: 'male',
        age:25,
      },
      {
        id: 9,
        name: { first: 'Nandhitha' },
        gender: 'female',
        age: 19,
      },
      {
        id: 10,
        name: { first: 'mahesh' },
        gender: 'male',
        age: 11,
      },
      {
        id: 11,
        name: { first: 'mamatha' },
        gender: 'female',
        age: 26,
      },
      {
        id: 12,
        name: { first: 'vamshi' },
        gender: 'male',
        age: 40,
      },
      {
        id: 13,
        name: { first: 'srinithi' },
        gender: 'female',
        age: 23,
      },
      {
        id: 14,
        name: { first: 'srikruthi' },
        gender: 'female',
        age: 55,
      },
      {
        id: 15,
        name: { first: 'greeshma' },
        gender: 'female',
        age: 18,
      },
      {
        id: 16,
        name: { first: 'mithun' },
        gender: 'male',
        age: 22,
      },
      {
        id: 17,
        name: { first: 'arjun' },
        gender: 'male',
        age: 10,
      },
      {
        id: 18,
        name: { first: 'deepak' },
        gender: 'male',
        age: 18,
      },
      {
        id: 19,
        name: { first: 'geetha' },
        gender: 'female',
        age: 30,
      },
      {
        id: 20,
        name: { first: 'prasanna' },
        gender: 'female',
        age: 24,
      },
      {
        id: 21,
        name: { first: 'raju' },
        gender: 'male',
        age: 36,
      },
      {
        id: 22,
        name: { first: 'vishal' },
        gender: 'male',
        age: 16,
      },
      {
        id: 23,
        name: { first: 'sunny' },
        gender: 'male',
        age: 11,
      },
      {
        id: 24,
        name: { first: 'sahithya' },
        gender: 'female',
        age: 8,
      },
    ];

    setData(hardcodedData);
    setLoading(false);

    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: hardcodedData.length,
      },
    });
  }, []);

  const columns = [
    showIdColumn
      ? {
          title: 'ID',
          dataIndex: 'id',
          sorter: (a, b) => a.id - b.id,
          width: '10%',
        }
      : null,
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.first.localeCompare(b.name.first),
      render: (name) => `${name.first}`,
      width: '25%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      filters: [
        {
          text: 'Male',
          value: 'male',
        },
        {
          text: 'Female',
          value: 'female',
        },
      ],
      width: '20%',
      ...getColumnSearchProps('gender'),
      render: (gender) => gender,
      onFilter: (value, record) => record['gender'] === value,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      sorter: (a, b) => a.age - b.age,
      width: '15%',
    },
  ].filter((column) => column !== null);

  return (
    <div>
      <Input
        placeholder="Search in all columns"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onPressEnter={() => handleSearchButton()}
        style={{
          marginBottom: 16,
          marginTop: 50,
          marginRight: 8,
          width: 600,
        }}
      />
      <Button type="primary" onClick={handleSearchButton}>
        Search
      </Button>
      <Button onClick={handleToggleIdColumn} style={{ marginLeft: 10 }}>
        {showIdColumn ? 'Hide ID Column' : 'Show ID Column'}
      </Button>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        onChange={handleTableChange}
        pagination={tableParams.pagination}
        style={{
          width: 800,
          marginLeft: 380,
          marginTop: 50,
        }}
      />
    </div>
  );
};

export default CombinedTable;