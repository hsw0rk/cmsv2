import React, { useState, useEffect, useContext } from "react";
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
import { data } from "../../../constants/admindata";
import UserInfo from "../../../Components/Admin/user-info/UserInfo";

import "./branch.css";

const Branch = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});
  const [editedPost, setEditedPost] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [regions, setRegions] = useState([]);
  const [showAdditionalbranch, setShowAdditionalbranch] = useState(false);


  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const [inputs, setInputs] = useState({
    regionName: "",
    regionCode: "",
    branchCode: "",
    branchName: "",
  });

  useEffect(() => {
    if (inputs.regionCode) {
      setFilteredRegions(
        regions.filter((region) => region.regionCode === inputs.regionCode)
      );
    } else {
      setFilteredRegions([]);
    }
  }, [inputs.regionCode, regions]);

  useEffect(() => {
    const fetchRegions = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getregioninuser"
      );
      setRegions(res.data);
    };
    fetchRegions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: name === 'branchName' ? value.toUpperCase() : value,
    }));
  
    if (name === 'regionCode') {
      const selectedRegion = regions.find((region) => region.regionCode === value);
      setInputs((prevInputs) => ({
        ...prevInputs,
        regionName: selectedRegion ? selectedRegion.regionName : '',
      }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const selectedRegion = regions.find((region) => region.regionCode === inputs.regionCode);
  
    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/adminbranch",
        {
          ...inputs,
          regionName: selectedRegion ? selectedRegion.regionName : "",
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
    axios.get("http://localhost:8800/api/auth/branchdata").then((res) => {
      setPosts(res.data);
    });
  }, []);

  const saveEditedPost = () => {
    const selectedRegion = regions.find(
      (region) => region.regionCode === editedPost.regionCode
    );
    if (selectedRegion) {
      const updatedPost = { ...editedPost, regionName: selectedRegion.regionName };
      axios
        .put(
          `http://localhost:8800/api/auth/editbranch/${editedPost.id}`,
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
    if (editedPost && editedPost.regionCode && regions.length > 0) {
      setFilteredRegions(
        regions.filter((region) => region.regionCode === editedPost.regionCode)
      );
    }
  }, [editedPost, regions]);

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
      regionName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      regionCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    setGlobalFilterValue("");
  };

  const downloadCSV = () => {
    // Define the headers for the CSV
    const headers = ["Region Name", "Region Code", "Branch Name", "Branch Code"];
  
    // Create an array of rows to be included in the CSV
    const rows = posts.map((post) => [
      post.regionName,
      post.regionCode,
      post.branchName,
      post.branchCode,
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
    link.setAttribute("download", "branchmaster.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const samplecsv = [
    { id: "", regionName: "", regionCode: "", branchName: "", branchCode: "" },
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
            await axios.post("http://localhost:8800/api/auth/adminbranch", row);
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
        Branch
      </p>

      <p
        type="button"
        className="Addbuttonbranch"
        onClick={() => setShowAdditionalbranch(true)}
      >
        <i className="fa fa-plus"></i>Click Here to Create Branch{" "}
      </p>

      <div className={`additional-branch ${showAdditionalbranch ? "show" : ""}`}>
      <div className="form-container-branch">
        <form className="formbranch" onSubmit={handleSubmit}>
          <div>
            <label>
              Region Code
              <select
                required
                className="userinput"
                id="regionCode"
                name="regionCode"
                value={inputs.regionCode || ""}
                onChange={(event) =>
                  setInputs({ ...inputs, regionCode: event.target.value })
                }
              >
                <option value="">Select Region Code</option>
                {regions.map((region) => (
                  <option key={region.regionCode} value={region.regionCode}>
                    {region.regionCode}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Region Name
              <select
                required
                className="userinput"
                id="regionName"
                name="regionName"
                value={inputs.regionName || ""}
                onChange={(event) =>
                  setInputs({ ...inputs, regionName: event.target.value })
                }
                style={{ pointerEvents: "none", appearance: "none" }}
              >
                {filteredRegions.map((region) => (
                  <option key={region.regionName} value={region.regionName}>
                    {region.regionName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Branch Name
              <input
                required
                autoComplete="off"
                className="branchinput"
                id="branchName"
                name="branchName"
                onChange={handleChange}
                style={{ textTransform: "uppercase" }}
              />
            </label>
          </div>

          <div>
            <label>
              Branch Code
              <input
                required
                autoComplete="off"
                className="branchinput"
                id="branchCode"
                name="branchCode"
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
                <a href="/admin/branchmaster">
                  <button className="investmsg-no" onClick={() => setErr(null)}>
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
              <a href="/admin/branchmaster">
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
              filename={"samplebranchdata"}
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
        <Column field="branchName" sortable  header="Branch Name"></Column>
        <Column field="branchCode" sortable header="Branch Code"></Column>
        <Column field="regionName" sortable header="Region Name"></Column>
        <Column field="regionCode" sortable header="Region Code"></Column>
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
        header="Update Branch Data"
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
                <label htmlFor="branchName">Branch Name</label>
                <InputText
                  required
                  id="branchName"
                  value={editedPost.branchName}
                  style={{ textTransform: "uppercase" }}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, branchName: e.target.value })
                  }
                />
              </div>
              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchCode">Branch Code</label>
                <InputText
                  required
                  id="branchCode"
                  value={editedPost.branchCode}
                  type="number"
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, branchCode: e.target.value })
                  }
                />
              </div>
              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="regionCode">Region Code</label>
                <select
                  required
                  id="regionCode"
                  name="regionCode"
                  value={editedPost.regionCode || ""}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, regionCode: e.target.value })
                  }
                  disabled={!editedPost}
                  className="userinput"
                >
                  <option value="">Select Region Code</option>
                  {regions.map((region) => (
                    <option key={region.regionCode} value={region.regionCode}>
                      {region.regionCode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="regionName">Region Name</label>
                <select
                  required
                  id="regionName"
                  name="regionName"
                  value={editedPost.regionName || ""}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, regionName: e.target.value })
                  }
                  disabled={!editedPost}
                  className="userinput"
                  style={{ pointerEvents: "none", appearance: "none" }}
                >
                  {filteredRegions.map((region) => (
                    <option key={region.regionName} value={region.regionName}>
                      {region.regionName}
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

export default Branch;
