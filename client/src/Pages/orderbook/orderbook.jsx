import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./orderbook.css";
import { AuthContext } from "../../context/authContext";
import { saveAs } from 'file-saver';
import exc from '../../Assets/exc.svg';

const OrderBook = () => {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:8800/api/auth/cmsverticalformdata");
      setData(result.data);
    };
    fetchData();
  }, []);

  const handleClick = (row) => {
    setSelectedRow(row);
  };

  const handleClose = () => {
    setSelectedRow(null);
  };

  // filter data to show only rows where employeename matches current user
  let filteredData = data.filter((row) => row.employeename === currentUser.employeename);

  // apply date filter if both fromDate and toDate are set
  if (fromDate && toDate) {
    filteredData = filteredData.filter((row) => {
      const rowDate = new Date(row.date);
      return rowDate >= fromDate && rowDate <= toDate;
    });
  }

  // apply search filter if searchQuery is set
  if (searchQuery) {
    filteredData = filteredData.filter((row) => {
      return (
        row.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.vertical.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.mobileno.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.principal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.business.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  const handleFilter = () => {
    const fromDateInput = document.getElementById("fromDateInput").value;
    const toDateInput = document.getElementById("toDateInput").value;
    const fromDateObj = fromDateInput ? new Date(fromDateInput) : null;
    const toDateObj = toDateInput ? new Date(toDateInput) : null;
    setFromDate(fromDateObj);
    setToDate(toDateObj);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDownload = () => {
    const headers = [
      { label: 'Vertical', key: 'vertical' },
      { label: 'Principal', key: 'principal' },
      { label: 'Product', key: 'product' },
      { label: 'PAN', key: 'pan' },
      { label: 'Credit Branch', key: 'creditbranch' },
      { label: 'Mobile No', key: 'mobileno' },
    ];

    const exportData = filteredData.map((row) => ({
      vertical: row.vertical,
      principal: row.principal,
      product: row.product,
      pan: row.pan,
      creditbranch: row.creditbranch,
      mobileno: row.mobileno,
    }));

    const stringify = (value) => {
      if (value === null || value === undefined) {
        return '';
      }
      return value.toString();
    };

    const csvData = [
      headers.map((header) => stringify(header.label)).join(','),
      ...exportData.map((row) => headers.map((header) => stringify(row[header.key])).join(',')),
    ].join('\r\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'orderbook.csv');
  };
  return (

    <div>
       <p style={{
  fontSize:"20px"
 }}>Order Book</p>
      <div className="flexclassorderbook">

        <div>
          <input type="text" className="orderbookinp" placeholder="Search..." value={searchQuery} onChange={handleSearch} />
        </div>

        <div className="orderbookdateandSearch">

          <label htmlFor="fromDateInput">From date:
            <input type="date" id="fromDateInput" /></label>

          <label htmlFor="toDateInput">To date:
            <input type="date" id="toDateInput" /></label>


          <button className="orderbookdatefilter" onClick={handleFilter}>Show</button>
          {/* <img src={exc} alt="Excel Download" className="excellogo" onClick={handleDownload} title="Download CSV" /> */}

        </div>
      </div>


      <table id="customers">
        <thead>
          <tr>
            <th>Vertical</th>
            <th>Principal</th>
            <th>Product</th>
            <th>PAN</th>
            <th>Credit Branch</th>
            <th>Mobile No</th>
            <th>More Info</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row.id}>
              <td>{row.vertical}</td>
              <td>{row.principal}</td>
              <td>{row.product}</td>
              <td>{row.pan}</td>
              <td>{row.creditbranch}</td>
              <td>{row.mobileno}</td>
              <td><u style={{ color: 'blue', cursor: 'pointer' }}><p style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleClick(row)}>More Info...</p></u></td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRow && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleClose}>
              &times;
            </span>
            <p className="customernameinv">Customer Name: {selectedRow.customername}</p><br />
            <ul className="otherinv">
              <li>Product:   {selectedRow.product}</li>
              <li>Principal:  {selectedRow.principal}</li>
              <li>Fresh/Renewal:  {selectedRow.freshrenewal}</li>
              <li>PAN:  {selectedRow.pan}</li>
              <li>Mobile Number:  {selectedRow.mobileno}</li>
              <li>Credit Branch:  {selectedRow.business}</li>
              <li>Vertical:  {selectedRow.vertical}</li>
              <li>Date:  {selectedRow.date}</li>
              <li>Time:  {selectedRow.time}</li>
              <li>Entry Owner:  {selectedRow.employeename}-{selectedRow.employeecode}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderBook;
