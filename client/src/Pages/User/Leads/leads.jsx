import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { DataTable } from 'primereact/datatable';
import { Dialog } from "primereact/dialog";
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
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


  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    leadRefID: { value: null, matchMode: FilterMatchMode.CONTAINS },
    customerCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    customerName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    branchCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    branchName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');



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


  useEffect(() => {
    setLoading(false);
  }, []);

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      leadRefID: { value: null, matchMode: FilterMatchMode.CONTAINS },
      customerCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      customerName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    setGlobalFilterValue('');
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
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
            style={{width:"32rem"}}
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


          <div style={{ marginLeft: "50px", marginBottom:".5rem"}}>
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
      loading={loading}
      className="datatable-responsive"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
      rows={5}
      showGridlines
      removableSort
      rowsPerPageOptions={[5, 10, 25, 50]}
      filterDisplay="row"
      globalFilterFields={['leadRefID', 'customerCode', 'customerName', 'branchCode', 'branchName']}
    >
      <Column
        field="leadRefID"
        sortable
        header="Lead RefID"
        filter
        filterMatchMode={filters.leadRefID.matchMode}
        filterField="leadRefID"
        filterPlaceholder="Search by leadRefID"
      />
      <Column
        field="customerCode"
        sortable
        header="Customer Code"
        filter
        filterMatchMode={filters.customerCode.matchMode}
        filterField="customerCode"
        filterPlaceholder="Search by customerCode"
        style={{ minWidth: '11.5rem' }}
      />
      <Column
        field="customerName"
        sortable
        header="Customer Name"
        filter
        filterMatchMode={filters.customerName.matchMode}
        filterField="customerName"
        filterPlaceholder="Search by customerName"
        style={{ minWidth: '11.5rem' }}
      />
      <Column
        field="branchCode"
        sortable
        header="Branch Code"
        filter
        filterMatchMode={filters.branchCode.matchMode}
        filterField="branchCode"
        filterPlaceholder="Search by branchCode"
        style={{ minWidth: '11.5rem' }}
      />
      <Column
        field="branchName"
        sortable
        header="Branch Name"
        filter
        filterMatchMode={filters.branchName.matchMode}
        filterField="branchName"
        filterPlaceholder="Search by branchName"
        style={{ minWidth: '11.5rem' }}
      />
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
            {selectedPost.leadRefID && (
              <p>
                <span className="my-dialog-title">Lead RefID:</span>
                <span className="my-dialog-value">{selectedPost.leadRefID}</span>
              </p>
            )}
            {selectedPost.customerCode && (
              <p>
                <span className="my-dialog-title">Customer Code:</span>
                <span className="my-dialog-value">{selectedPost.customerCode}</span>
              </p>
            )}
            {selectedPost.customerName && (
              <p>
                <span className="my-dialog-title">Customer Name:</span>
                <span className="my-dialog-value">{selectedPost.customerName}</span>
              </p>
            )}
            {selectedPost.branchCode && (
              <p>
                <span className="my-dialog-title">Branch Code:</span>
                <span className="my-dialog-value">{selectedPost.branchCode}</span>
              </p>
            )}
            {selectedPost.branchName && (
              <p>
                <span className="my-dialog-title">Branch Name:</span>
                <span className="my-dialog-value">{selectedPost.branchName}</span>
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