import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { DataTable } from 'primereact/datatable';
import { Dialog } from "primereact/dialog";
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
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
  const [selectedFilter, setSelectedFilter] = useState("conversionDate");


  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    leadRefID: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    customerName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    branchName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(null);



  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dueDateFrom, setDueDateFrom] = useState("");
  const [dueDateTo, setDueDateTo] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/auth/employeelead?from=${fromDate}&to=${toDate}&duefrom=${dueDateFrom}&dueto=${dueDateTo}`
        );
        const filteredPosts = response.data.filter(
          (post) => post.employeeCode === currentUser.employeeCode
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, fromDate, toDate, dueDateFrom, dueDateTo]);

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
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
      customerName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    setGlobalFilterValue('');
    setSelectedStatusFilter(null); // Reset the selected status filter
  };
  

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  
  const onStatusFilterChange = (e) => {
    const value = e.value;
    let _filters = { ...filters };
    if (value) {
      _filters['status'].value = value;
    } else {
      delete _filters['status'].value; // Remove the 'status' filter if value is cleared
    }
    setFilters(_filters);
    setSelectedStatusFilter(value);
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
            style={{ width: "32rem" }}
          />
        </span>
      </div>



      <div className="flex justify-content-start gap-5 clearred" style={{ marginTop: "30px", marginBottom: "10px", marginLeft: "20px" }}>
        <div className="flex align-items-end justify-content-start gap-2 exc">
          <div className="orderbook-dates">
            <select className="investmentsinput" value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
              <option value="conversionDate">Conversion Date</option>
              <option value="dueDate">Due Date</option>
            </select>

            {selectedFilter === "conversionDate" && (
              <>
                <label htmlFor="fromDate">From: </label>
                <div className="input-wrapper">
                  <input
                    id="fromDate"
                    type="date"
                    className="orderboofromDate"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <label htmlFor="toDate">To: </label>
                <div className="input-wrapper">
                  <input
                    id="toDate"
                    type="date"
                    className="orderbooktoDate"
                    value={toDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedFilter === "dueDate" && (
              <>
                <label htmlFor="duefromDate">From: </label>
                <div className="input-wrapper">
                  <input
                    id="duefromDate"
                    type="date"
                    className="orderboofromDate"
                    value={dueDateFrom}
                    onChange={(e) => setDueDateFrom(e.target.value)}
                  />
                </div>

                <label htmlFor="duetoDate">To: </label>
                <div className="input-wrapper">
                  <input
                    id="duetoDate"
                    type="date"
                    className="orderbooktoDate"
                    value={dueDateTo}
                    onChange={(e) => setDueDateTo(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>


      {/* <div style={{ marginLeft: "50px", marginBottom:".5rem"}}>
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
          </div> */}

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
        columnResizeMode="expand" resizableColumns
        globalFilterFields={['leadRefID', 'status', 'customerName', 'branchName']}
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
  field="status"
  sortable
  header="Status"
  filter
  filterMatchMode={filters.status.matchMode}
  filterField="status"
  filterElement={
    <Dropdown
      value={selectedStatusFilter}
      options={[
        { label: 'Converted', value: 'Converted' },
        { label: 'Follow Up', value: 'Follow Up' }
      ]}
      onChange={onStatusFilterChange} // Update the onChange handler
      placeholder="Select a status"
    />
  }
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
            {selectedPost.businessAmount && (
              <p>
                <span className="my-dialog-title">Business Amount:</span>
                <span className="my-dialog-value">{selectedPost.businessAmount}</span>
              </p>
            )}
            {selectedPost.verticalName && (
              <p>
                <span className="my-dialog-title">Vertical Name:</span>
                <span className="my-dialog-value">{selectedPost.verticalName}</span>
              </p>
            )}

            {selectedPost.lastModified && (
              <p>
                <span className="my-dialog-title">Conversion Date:</span>
                <span className="my-dialog-value">{selectedPost.lastModified.substring(0, 10)}</span>
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
