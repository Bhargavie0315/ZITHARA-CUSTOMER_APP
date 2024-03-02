import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import fetchCustomers from './fetchCustomers';
import './CustomerTable.css';
import axios from 'axios';


const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState({
    sortBy: 'date',
    sortOrder: 'asc'
  });

  const pageSize = 20;

  useEffect(() => {
    const fetchData = async () => {
    //   try {
    //     const data = await fetchCustomers();
    //     setCustomers(data);
    //     setTotalPages(Math.ceil(data.length / pageSize));
    //   } catch (error) {
    //     console.log(error);
    //   }
    try{
        const response = await axios.get(`http://localhost:5000/api/customers?page=${page}&limit=20`);
        setCustomers(response.data);
        // Assuming the response contains the total number of records
        const totalCount = response.headers['x-total-count'];
        setTotalPages(Math.ceil(totalCount / 20));
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchData();
  }, [page]);

  
  const handleSearch = async (event) => {
    event.preventDefault();
    const data = await fetchCustomers();
    const filteredCustomers = data.filter((customer) => {
      const name = customer.customer_name ? customer.customer_name.toLowerCase() : '';
      const location = customer.c_location ? customer.c_location.toLowerCase() : '';
      return name.includes(searchTerm.toLowerCase()) || location.includes(searchTerm.toLowerCase());
    });
    setCustomers(filteredCustomers);
    setTotalPages(Math.ceil(filteredCustomers.length / pageSize));
  };

  const handleSort = (event) => {
    const { value } = event.target;
    setSortOption(prevState => ({
      ...prevState,
      sortBy: value
    }));
  };
  const compareDates = (a, b) => {
    let comparison = 0;
    if (sortOption.sortOrder === 'asc') {
      comparison = new Date(a.created_at) - new Date(b.created_at);
    } else {
      comparison = new Date(b.created_at) - new Date(a.created_at);
    }
    return comparison;
  };
  const compareTimes = (a, b) => {
    let comparison = 0;
    if (sortOption.sortOrder === 'asc') {
      comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else {
      comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return comparison;
  };

  let sortedCustomers = [...customers];
  if (sortOption.sortBy === 'date') {
    sortedCustomers.sort(compareDates);
  } else if (sortOption.sortBy === 'time') {
    sortedCustomers.sort(compareTimes);
  }

  const handlePageChange = (page) => {
    console.log('page is',page);
    setPage(page);
  };

//   const renderPageNumbers = () => {
//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//       pageNumbers.push(
//         <li key={i} className={i === page ? 'active' : ''}>
//           <button onClick={() => handlePageChange(i)}>{i}</button>
//         </li>
//       );
//     }
//     return pageNumbers;
//   };

  return (
    <div>
      <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search by Name or Location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button type='submit' onClick={handleSearch} className="submit-button">Submit</button>
    </div>
    <div className="sort-dropdown">
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortOption.sortBy} onChange={handleSort}>
          <option value="date">Date</option>
          <option value="time">Time</option>
        </select>
        <button onClick={() => setSortOption(prevState => ({
          ...prevState,
          sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
        }))}>
          {sortOption.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>
      <Table striped bordered hover className='customer-table'>
        <thead>
          <tr>
            <th>S. No</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {sortedCustomers.map((customer, index) => (
            <tr key={index}>
              <td>{customer.s_no}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone_number}</td>
              <td>{customer.c_location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="page-container">
        <div className="pagination">
          <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>Previous</button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
