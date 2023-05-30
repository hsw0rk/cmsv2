import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import exc from "../../../Assets/exc.svg";
import axios from "axios";
import "./leads.css";
import { data } from "../../../constants/data";
import UserInfo from "../../../Components/User/user-info/UserInfo";

const Leads = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/auth/employeelead`
        );
        const filteredPosts = response.data.filter(
          (post) => post.employeeCode === currentUser.employeeCode
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [currentUser, fromDate, toDate]);


  const dialogFooterTemplate = () => {
    return (
      <Button
        label="Ok"
        icon="pi pi-check"
        onClick={() => setDialogVisible(false)}
      />
    );
  };

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      productName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      principal: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      freshRenewal: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      customerName: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/auth/employeelead"
        );
        const filteredPosts = response.data.filter(
          (post) => post.employeeCode === currentUser.employeeCode
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [currentUser]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    if (_filters.global) {
      _filters.global.value = value;
    } else {
      _filters.global = { value, matchMode: FilterMatchMode.CONTAINS };
    }

    setFilters(_filters);
    setGlobalFilterValue(value);
  };



  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      posts.map((post) => Object.values(post).join(",")).join("\n");
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="form">
      <div className="suser">
        <UserInfo user={data.user} />
      </div>
      <div
        className="flex justify-content-start gap-5 clearred"
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter}
          style={{ marginLeft: "20px", color: "red" }}
        />
        <span className="p-input-icon-left search">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
            className="searchbar"
          />
        </span>
      </div>

      <div
        className="flex justify-content-start gap-5 clearred"
        style={{ marginTop: "30px", marginBottom: "10px", marginLeft: "20px" }}>
        <div className="flex align-items-end justify-content-start gap-2 exc"
          >

          <div className="orderbook-dates">
            <label htmlFor="fromDate">From: </label>
            <div className="input-wrapper">
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                className="orderboofromDate"
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>


            <label htmlFor="toDate">To: </label>
            <div className="input-wrapper">
              <input
                type="date"
                id="toDate"
                value={toDate}
                className="orderbooktoDate"
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>


          <div style={{ marginLeft: "40px", }}>
            <Button
              type="button"
              icon={<img alt="excel icon" src={exc} />}
              rounded
              onClick={downloadCSV}
              style={{
                backgroundColor: "lightgreen",
                border: "none",
              }}
              title="Download CSV"
            />
          </div>



        </div>
      </div>

      <DataTable
        value={posts}
        filters={filters}
        responsiveLayout="scroll"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        dataKey="id"
        paginator
        emptyMessage="No data found."
        className="datatable-responsive"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
        rows={5}
        showGridlines
        removableSort
        rowsPerPageOptions={[5, 10, 25, 50]}
      >
        <Column field="leadRefID" sortable header="leadRefID"></Column>
        <Column field="employeeCode" sortable header="employeeCode"></Column>
        <Column field="employeeName" sortable header="employeeName"></Column>
        <Column
          body={(rowData) => (
            <Button
              label="More Info"
              icon="pi pi-info-circle"
              onClick={() => {
                setSelectedPost(rowData);
                setDialogVisible(true);
              }}
            />
          )}
        />
      </DataTable>
      <Dialog
        header="Post Details"
        visible={dialogVisible}
        style={{ width: "50vw" }}
        maximizable
        modal
        onHide={() => setDialogVisible(false)}
        footer={dialogFooterTemplate}
        className="my-dialog"
      >
        {selectedPost && (
          <div>
            {selectedPost.customerName && (
              <p>
                <span className="my-dialog-title">Customer Name:</span>
                <span className="my-dialog-value">{selectedPost.customerName}</span>
              </p>
            )}
            {selectedPost.productName && (
              <p>
                <span className="my-dialog-title">Product:</span>
                <span className="my-dialog-value">{selectedPost.productName}</span>
              </p>
            )}
            {selectedPost.principal && (
              <p>
                <span className="my-dialog-title">Principal:</span>
                <span className="my-dialog-value">{selectedPost.principal}</span>
              </p>
            )}
            {selectedPost.freshRenewal && (
              <p>
                <span className="my-dialog-title">Fresh Renewal:</span>
                <span className="my-dialog-value">{selectedPost.freshRenewal}</span>
              </p>
            )}
            {selectedPost.pan && (
              <p>
                <span className="my-dialog-title">PAN:</span>
                <span className="my-dialog-value">{selectedPost.pan}</span>
              </p>
            )}
            {selectedPost.mobileNumber && (
              <p>
                <span className="my-dialog-title">Mobile Number:</span>
                <span className="my-dialog-value">{selectedPost.mobileNumber}</span>
              </p>
            )}
            {selectedPost.creditBranch && (
              <p>
                <span className="my-dialog-title">Credit Branch:</span>
                <span className="my-dialog-value">{selectedPost.creditBranch}</span>
              </p>
            )}
            {selectedPost.business && (
              <p>
                <span className="my-dialog-title">Business:</span>
                <span className="my-dialog-value">{selectedPost.business}</span>
              </p>
            )}
            {selectedPost.vertical && (
              <p>
                <span className="my-dialog-title">Vertical:</span>
                <span className="my-dialog-value">{selectedPost.vertical}</span>
              </p>
            )}
            {selectedPost.date && (
              <p>
                <span className="my-dialog-title">Date:</span>
                <span className="my-dialog-value">
                  {selectedPost.date.split("T")[0]}
                </span>
              </p>
            )}

            {selectedPost.time && (
              <p>
                <span className="my-dialog-title">Time:</span>
                <span className="my-dialog-value">{selectedPost.time}</span>
              </p>
            )}
            {selectedPost.employeeName && (
              <p>
                <span className="my-dialog-title">Entry Owner:</span>
                <span className="my-dialog-value">{selectedPost.employeeName}</span>
              </p>
            )}
          </div>
        )}
      </Dialog>

    </div>
  );
};

export default Leads;