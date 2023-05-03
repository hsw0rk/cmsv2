import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./orderbook.css";
import { AuthContext } from "../../context/authContext";

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

  return (

    <div>
      <div className="flexclassorderbook">

        <div>
          <input type="text" className="orderbookinp" placeholder="Search..." value={searchQuery} onChange={handleSearch} />
        </div>

        <div className="orderbookdateandSearch">

          <label htmlFor="fromDateInput">From date:
            <input type="date" id="fromDateInput" /></label>

          <label htmlFor="toDateInput">To date:
            <input type="date" id="toDateInput" /></label>


          <button className="orderbookdatefilter" onClick={handleFilter}>Filter</button>

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