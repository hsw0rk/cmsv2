import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import exc from "../../../Assets/exc.svg";
import axios from "axios";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import "./Businesshead.css";
import { data } from "../../../constants/admindata";
import UserInfo from "../../../Components/Admin/user-info/UserInfo";

const Businesshead = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});
  const [editedPost, setEditedPost] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [filteredverticals, setFilteredVerticals] = useState([]);
  const [verticals, setverticals] = useState([]);
  const [showAdditionalbranch, setShowAdditionalbranch] = useState(false);

  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const [inputs, setInputs] = useState({
    verticalName: "",
    verticalCode: "",
    businessHeadCode: "",
    businessHeadName: "",
  });

  useEffect(() => {
    if (inputs.verticalCode) {
      setFilteredVerticals(
        verticals.filter((vertical) => vertical.verticalCode === inputs.verticalCode)
      );
    } else {
      setFilteredVerticals([]);
    }
  }, [inputs.verticalCode, verticals]);

  useEffect(() => {
    const fetchverticals = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getverticalinbusinesshead"
      );
      setverticals(res.data);
    };
    fetchverticals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "verticalCode") {
      const selectedvertical = verticals.find(
        (vertical) => vertical.verticalCode === value
      );
      setInputs((prevInputs) => ({
        ...prevInputs,
        verticalName: selectedvertical ? selectedvertical.verticalName : "",
      }));
    } else if (name === "businessHeadCode") { // Add this block to update businessHeadCode
      setInputs((prevInputs) => ({
        ...prevInputs,
        businessHeadCode: value,
      }));
    } else if (name === "businessHeadName") { // Add this block to update businessHeadName
      setInputs((prevInputs) => ({
        ...prevInputs,
        businessHeadName: value,
      }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const selectedvertical = verticals.find(
      (vertical) => vertical.verticalCode === inputs.verticalCode
    );
  
    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/adminbusinesshead",
        {
          ...inputs,
          verticalName: selectedvertical ? selectedvertical.verticalName : "",
          businessHeadCode: inputs.businessHeadCode, // Include businessHeadCode
          businessHeadName: inputs.businessHeadName, // Include businessHeadName
        }
      );
      setMsg(response.data);
      setErr(null);
    } catch (err) {
      setErr(err.response.data);
      setMsg(null);
    }
  };
  

  useEffect(() => {
    axios.get("http://localhost:8800/api/auth/businessheaddata").then((res) => {
      setPosts(res.data);
    });
  }, []);

  const saveEditedPost = () => {
    const selectedVertical = verticals.find(
      (vertical) => vertical.verticalCode === editedPost.verticalCode
    );
    if (selectedVertical) {
      const updatedPost = { ...editedPost, verticalName: selectedVertical.verticalName };
      axios
        .put(
          `http://localhost:8800/api/auth/editbusinesshead/${editedPost.id}`,
          updatedPost
        )
        .then((res) => {
          setPosts(
            posts.map((post) => (post.id === editedPost.id ? updatedPost : post))
          );
          setEditedPost(null);
          setEditDialogVisible(false);
          alert("You have edited the data.");
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    if (editedPost && editedPost.verticalCode && verticals.length > 0) {
      setFilteredVerticals(
        verticals.filter((vertical) => vertical.verticalCode === editedPost.verticalCode)
      );
    }
  }, [editedPost, verticals]);

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
      verticalName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      verticalCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      businessHeadCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      businessHeadName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    setGlobalFilterValue("");
  };

  const downloadCSV = () => {
    // Define the headers for the CSV
    const headers = [
      "vertical Name",
      "vertical Code",
      "vertical Head Name",
      "vertical Head Code",
    ];

    // Create an array of rows to be included in the CSV
    const rows = posts.map((post) => [
      post.verticalName,
      post.verticalCode,
      post.businessHeadName,
      post.businessHeadCode,
    ]);

    // Combine headers and rows into a single array
    const csvData = [headers, ...rows];

    // Convert the array to CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((row) => row.join(",")).join("\n");

    // Create a download link and trigger the download
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "verticalheadmaster.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const samplecsv = [
    {
      id: "",
      verticalName: "",
      verticalCode: "",
      businessHeadName: "",
      businessHeadCode: "",
    },
  ];

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const { data } = results;
        const filteredData = data.filter((row) => {
          // Check if all values in the row are empty or not
          return Object.values(row).some((value) => value.trim() !== "");
        });
        for (let i = 0; i < filteredData.length; i++) {
          const row = filteredData[i];
          try {
            await axios.post("http://localhost:8800/api/auth/adminbusinesshead", row);
            console.log(`Inserted row ${i + 1}: ${JSON.stringify(row)}`);
          } catch (err) {
            console.error(
              `Error inserting row ${i + 1}: ${JSON.stringify(row)}`
            );
            console.error(err);
            alert("Error occurred while uploading data. Please try again.");
            return;
          }
        }
        setPosts(filteredData);
        alert("Data has been uploaded successfully.");
      },
      error: (error) => {
        console.error(error);
        alert("Error occurred while uploading data. Please try again.");
      },
    });
  };

  return (
    <div className="form">
      <div className="suser">
        <UserInfo user={data.user} />
      </div>
      <p
        style={{
          fontSize: "20px",
        }}
      >
        Business Head
      </p>

      <p
        type="button"
        className="Addbuttonbranch"
        onClick={() => setShowAdditionalbranch(true)}
      >
        <i className="fa fa-plus"></i>Click Here to Create Business Head{" "}
      </p>

      <div
        className={`additional-branch ${showAdditionalbranch ? "show" : ""}`}
      >
        <div className="form-container-branch">
          <form className="formbranch" onSubmit={handleSubmit}>
            <div>
              <label>
                vertical Code
                <select
                  required
                  className="userinput"
                  id="verticalCode"
                  name="verticalCode"
                  value={inputs.verticalCode || ""}
                  onChange={(event) =>
                    setInputs({ ...inputs, verticalCode: event.target.value })
                  }
                >
                  <option value="">Select vertical Code</option>
                  {verticals.map((vertical) => (
                    <option key={vertical.verticalCode} value={vertical.verticalCode}>
                      {vertical.verticalCode}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label>
                vertical Name
                <select
                  required
                  className="userinput"
                  id="verticalName"
                  name="verticalName"
                  value={inputs.verticalName || ""}
                  onChange={(event) =>
                    setInputs({ ...inputs, verticalName: event.target.value })
                  }
                >
                  {filteredverticals.map((vertical) => (
                    <option key={vertical.verticalName} value={vertical.verticalName}>
                      {vertical.verticalName}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label>
              Business Head Name
                <input
                  required
                  autoComplete="off"
                  className="branchinput"
                  id="businessHeadName"
                  name="businessHeadName"
                  onChange={handleChange}
                />
              </label>
            </div>

            <div>
              <label>
                Business Head Code
                <input
                  required
                  autoComplete="off"
                  className="branchinput"
                  id="businessHeadCode"
                  name="businessHeadCode"
                  onChange={handleChange}
                  type="number"
                />
              </label>
            </div>

            <button type="submit" className="Submitbuttonbranch">
              Submit
            </button>
          </form>

          {err && (
            <>
              <div className="popup-background"></div>
              <div className="popup-wrapper">
                <p className="investmsgp">{err}</p>
                <div className="investmsg-buttons">
                  <button className="investmsg-yes" onClick={handleSubmit}>
                    Yes
                  </button>
                  <a href="/admin/businessheadmaster">
                    <button
                      className="investmsg-no"
                      onClick={() => setErr(null)}
                    >
                      No
                    </button>
                  </a>
                </div>
              </div>
            </>
          )}

          {msg && (
            <>
              <div className="popup-background"></div>
              <div className="popup-wrapper">
                <p className="investmsgp">{msg}</p>
                <a href="/admin/businessheadmaster">
                  <p className="investmsgclose" onClick={() => setMsg(null)}>
                    close
                  </p>
                </a>
              </div>
            </>
          )}
        </div>

        <input
          type="file"
          className="branchfile"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />

        <div
          className="flex align-items-end justify-content-end gap-2 exc"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "2px",
            marginBottom: "30px",
            marginTop: "-60px",
          }}
        >
          <Button>
            <CSVLink
              data={samplecsv}
              filename={"sampleverticalheaddata"}
              target="_blank"
            >
              Sample
            </CSVLink>
          </Button>

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
        selection={selectedPost}
        onRowSelect={(e) => setSelectedPost(e.data)}
        onRowUnselect={() => setSelectedPost(null)}
      >
        <Column field="businessHeadCode" sortable header="Business Head Code"></Column>
        <Column field="businessHeadName" sortable header="Business Head Name"></Column>
        <Column field="verticalCode" sortable header="Vertical Code"></Column>
        <Column field="verticalName" sortable header="Vertical Name"></Column>
        <Column
          body={(rowData) => (
            <Button
              label="Update"
              icon="pi pi-pencil"
              onClick={() => {
                setEditedPost(rowData);
                setEditDialogVisible(true);
              }}
            />
          )}
        />
      </DataTable>
      <Dialog
        header="Edit Business Head Data"
        visible={editDialogVisible}
        style={{ width: "50vw" }}
        modal
        onHide={() => setEditDialogVisible(false)}
        className="my-dialog"
      >
        {editedPost && (
          <div>
            <div className="p-fluid">
              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="businessHeadCode">Business Head Code</label>
                <InputText
                  id="businessHeadCode"
                  value={editedPost.businessHeadCode}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      businessHeadCode: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="businessHeadName">Business Head Name</label>
                <InputText
                  id="businessHeadName"
                  value={editedPost.businessHeadName}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      businessHeadName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="verticalCode">vertical Code</label>
                <select
                  required
                  id="verticalCode"
                  name="verticalCode"
                  value={editedPost.verticalCode || ""}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, verticalCode: e.target.value })
                  }
                  disabled={!editedPost}
                  className="userinput"
                >
                  <option value="">Select vertical Code</option>
                  {verticals.map((vertical) => (
                    <option key={vertical.verticalCode} value={vertical.verticalCode}>
                      {vertical.verticalCode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="verticalName">vertical Name</label>
                <select
                  required
                  id="verticalName"
                  name="verticalName"
                  value={editedPost.verticalName || ""}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, verticalName: e.target.value })
                  }
                  disabled={!editedPost}
                  className="userinput"
                >
                  {filteredverticals.map((vertical) => (
                    <option key={vertical.verticalName} value={vertical.verticalName}>
                      {vertical.verticalName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button label="Save" icon="pi pi-check" onClick={saveEditedPost} />
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Businesshead;