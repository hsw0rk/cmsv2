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
import "./orderbook.css";

const OrderBook = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});

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
    axios
      .get("http://localhost:8800/api/auth/cmsverticalformdata")
      .then((res) => {
        // Filter the posts array based on the currentUser email
        const filteredPosts = res.data.filter(
          (post) => post.employeecode === currentUser.employeecode
        );
        setPosts(filteredPosts);
      });
  }, [currentUser]);

  const clearFilter = () => {
    initFilters();
  };

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

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      product: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      principal: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      freshrenewal: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      customername: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      posts.map((post) => Object.values(post).join(",")).join("\n");
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "posts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="form">
      <div className="flex justify-content-between gap-5 clearred">
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
        <div className="flex align-items-end justify-content-end gap-2 exc">
          <Button
            type="button"
            icon={<img alt="excel icon" src={exc} />}
            rounded
            onClick={downloadCSV}
            style={{
              marginRight: "20px",
              backgroundColor: "lightgreen",
              border: "none",
            }}
            title="Download CSV"
          />
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
        <Column field="vertical" sortable header="Vertical"></Column>
        <Column field="principal" sortable header="Principal"></Column>
        <Column field="product" sortable header="Product"></Column>
        <Column field="pan" sortable header="PAN"></Column>
        <Column field="business" sortable header="Credit Branch"></Column>
        <Column field="mobileno" sortable header="Mobile Number"></Column>
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
            <p>
              <span className="my-dialog-title">Customer Name:</span>
              <span className="my-dialog-value">
                {selectedPost.customername}
              </span>
            </p>
            <p>
              <span className="my-dialog-title">Product:</span>
              <span className="my-dialog-value">{selectedPost.product}</span>
            </p>
            <p>
              <span className="my-dialog-title">Principal:</span>
              <span className="my-dialog-value">{selectedPost.principal}</span>
            </p>
            <p>
              <span className="my-dialog-title">Fresh Renewal:</span>
              <span className="my-dialog-value">
                {selectedPost.freshrenewal}
              </span>
            </p>
            <p>
              <span className="my-dialog-title">PAN:</span>
              <span className="my-dialog-value">{selectedPost.pan}</span>
            </p>
            <p>
              <span className="my-dialog-title">Mobile Number:</span>
              <span className="my-dialog-value">{selectedPost.mobileno}</span>
            </p>
            <p>
              <span className="my-dialog-title">Credit Branch:</span>
              <span className="my-dialog-value">{selectedPost.business}</span>
            </p>
            <p>
              <span className="my-dialog-title">Vertical:</span>
              <span className="my-dialog-value">{selectedPost.vertical}</span>
            </p>
            <p>
              <span className="my-dialog-title">Date:</span>
              <span className="my-dialog-value">{selectedPost.date}</span>
            </p>
            <p>
              <span className="my-dialog-title">Time:</span>
              <span className="my-dialog-value">{selectedPost.time}</span>
            </p>
            <p>
              <span className="my-dialog-title">Entry Owner:</span>
              <span className="my-dialog-value">{selectedPost.employeename}</span>
            </p>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default OrderBook;
