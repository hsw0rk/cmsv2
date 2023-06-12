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
import "./verticalhead.css";
import { data } from "../../../constants/admindata";
import UserInfo from "../../../Components/Admin/user-info/UserInfo";

const Verticalhead = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});
  const [editedPost, setEditedPost] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const [inputs, setInputs] = useState({
    verticalHeadCode: "",
    verticalHeadName: "",
    verticalCode: "",
    verticalName: "",
    businessHeadCode: "",
    businessHeadName: "",
    regionCode: "",
    regionName: "",
    regionHeadCode: "",
    regionHeadName: "",
  });

  const [vertical, setvertical] = useState([]);
  const [businesshead, setbusinesshead] = useState([]);
  const [region, setregion] = useState([]);
  const [regionhead, setregionhead] = useState([]);
  const [filteredverticals, setFilteredverticals] = useState([]);
  const [filteredregions, setFilteredregions] = useState([]);
  const [filteredregionheads, setFilteredregionheads] = useState([]);
  const [filteredbusinessheads, setFilteredbusinessheads] = useState([]);
  const [showAdditionaluser, setShowAdditionaluser] = useState(false);
  const [filteredEditverticals, setFilteredEditverticals] = useState([]);
  const [filteredEditbusinessheads, setFilteredEditbusinessheads] = useState([]);
  const [filteredEditregions, setFilteredEditregions] = useState([]);
  const [filteredEditregionheads, setFilteredEditregionheads] = useState([]);

  // fetch
  useEffect(() => {
    const fetchvertical = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getverticalinverticalhead"
      );
      setvertical(res.data);
    };

    const fetchbusinesshead = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getbusinessinverticalhead"
      );
      setbusinesshead(res.data);
    };

    const fetchregion = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getregioninverticalhead"
      );
      setregion(res.data);
    };

    const fetchregionhead = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getregionheadinverticalhead"
      );
      setregionhead(res.data);
    };

    fetchvertical();
    fetchregion();
    fetchbusinesshead();
    fetchregionhead();
  }, []);

  //filters
  useEffect(() => {
    if (inputs.verticalCode) {
      const filteredverticals = vertical.filter(
        (verticals) => verticals.verticalCode === inputs.verticalCode
      );
      setFilteredverticals(filteredverticals);

      const filteredbusinessheads = businesshead.filter(
        (businessheads) => businessheads.verticalCode === inputs.verticalCode
      );
      setFilteredbusinessheads(filteredbusinessheads);
    } else {
      setFilteredverticals([]);
      setFilteredbusinessheads([]);
    }

    if (inputs.regionCode) {
      const filteredregions = region.filter(
        (regions) => regions.regionCode === inputs.regionCode
      );
      setFilteredregions(filteredregions);

      const filteredregionheads = regionhead.filter(
        (regionheads) => regionheads.regionCode === inputs.regionCode
      );
      setFilteredregionheads(filteredregionheads);
    } else {
      setFilteredregions([]);
      setFilteredregionheads([]);
    }
  }, [
    inputs.verticalCode,
    vertical,
    businesshead,
    inputs.regionCode,
    region,
    regionhead,
  ]);

  useEffect(() => {
    if (editedPost && editedPost.verticalCode) {
      const filteredverticals = vertical.filter(
        (verticals) => verticals.verticalCode === editedPost.verticalCode
      );
      setFilteredEditverticals(filteredverticals);
  
      const filteredbusinessheads = businesshead.filter(
        (businessheads) => businessheads.verticalCode === editedPost.verticalCode
      );
      setFilteredEditbusinessheads(filteredbusinessheads);
    } else {
      setFilteredEditverticals([]);
      setFilteredEditbusinessheads([]);
    }
  
    if (editedPost && editedPost.regionCode) {
      const filteredregions = region.filter(
        (regions) => regions.regionCode === editedPost.regionCode
      );
      setFilteredEditregions(filteredregions);
  
      const filteredregionheads = regionhead.filter(
        (regionheads) => regionheads.regionCode === editedPost.regionCode
      );
      setFilteredEditregionheads(filteredregionheads);
    } else {
      setFilteredEditregions([]);
      setFilteredEditregionheads([]);
    }
  }, [editedPost, vertical, businesshead, region, regionhead]);  

  //input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    if (name === "verticalCode") {
      const selectedVertical = businesshead.find(
        (businessheads) => businessheads.verticalCode === value
      );

      setInputs((prevInputs) => ({
        ...prevInputs,
        verticalName: selectedVertical ? selectedVertical.verticalName : "",
        businessHeadName: selectedVertical
          ? selectedVertical.businessHeadName
          : "",
        businessHeadCode: selectedVertical
          ? selectedVertical.businessHeadCode
          : "",
      }));
    }

    if (name === "regionCode") {
      const selectedRegion = region.find(
        (regions) => regions.regionCode === value
      );
      console.log("selectedRegion:", selectedRegion);
      setInputs((prevInputs) => ({
        ...prevInputs,
        regionName: selectedRegion ? selectedRegion.regionName : "",
        regionHeadName: "",
      }));

      const filteredregionheads = regionhead.filter(
        (regionheads) => regionheads.regionCode === value
      );
      setFilteredregionheads(filteredregionheads);

      if (filteredregionheads.length === 1) {
        const selectedRegionHead = filteredregionheads[0];
        console.log("selectedRegionHead:", selectedRegionHead);
        setInputs((prevInputs) => ({
          ...prevInputs,
          regionHeadName: selectedRegionHead.regionHeadName,
          regionHeadCode: selectedRegionHead.regionHeadCode,
        }));
      }
    }
  };

  //form submit (insert)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/adminverticalhead",
        { ...inputs }
      );
      setMsg(response.data); // Extract the 'msg' property from the response object
      setErr(null);
    } catch (err) {
      setErr(err.response.data); // Extract the 'err' property from the error object
      setMsg(null);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8800/api/auth/verticalheaddata").then((res) => {
      setPosts(res.data);
    });
  }, []);

  const saveEditedPost = () => {
    console.log("Edited Post:", editedPost);
  
    const selectedVertical = vertical.find(
      (verticals) => verticals.verticalCode === editedPost.verticalCode
    );
    console.log("Selected Vertical:", selectedVertical);
  
    const selectedBusinessHead = businesshead.find(
      (businessheads) =>
        businessheads.verticalCode === editedPost.verticalCode 
    );
    console.log("Selected Business Head:", selectedBusinessHead);
    
    const selectedRegion = region.find(
      (regions) => regions.regionCode === editedPost.regionCode
    );
    console.log("Selected Region:", selectedRegion);
  
    const selectedRegionHead = regionhead.find(
      (regionheads) =>
        regionheads.regionCode === editedPost.regionCode 
    );
    
    console.log("Selected Region Head:", selectedRegionHead);
  
    if (
      selectedVertical &&
      selectedBusinessHead &&
      selectedRegion &&
      selectedRegionHead
    ) {
      const updatedPost = {
        ...editedPost,
        verticalName: selectedVertical.verticalName,
        businessHeadName: selectedBusinessHead.businessHeadName,
        businessHeadCode: selectedBusinessHead.businessHeadCode,
        regionName: selectedRegion.regionName,
        regionHeadName: selectedRegionHead.regionHeadName,
        regionHeadCode: selectedRegionHead.regionHeadCode,
      };
  
      axios
        .put(
          `http://localhost:8800/api/auth/editverticalhead/${editedPost.id}`,
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
    } else {
      // Handle the case when a selected value is not found
      console.log("One or more selected values not found.");
      alert("One or more selected values not found.");
    }
  };

  useEffect(() => {
    if (
      editedPost &&
      editedPost.regionCode &&
      region.length > 0 &&
      editedPost.regionHeadCode &&
      regionhead.length > 0
    ) {
        const filteredRegions = region.filter(
          (regions) => regions.regionCode === editedPost.regionCode
        );
        setFilteredregions(filteredRegions);
    
        const filteredRegionHeads = regionhead.filter(
          (regionheads) =>
          regionheads.regionCode === editedPost.regionCode &&
          regionheads.regionHeadName === editedPost.regionHeadName &&
          regionheads.regionHeadCode === editedPost.regionHeadCode
        );
        setFilteredregionheads(filteredRegionHeads);
    }
    if (
      editedPost &&
      editedPost.verticalCode &&
      vertical.length > 0 &&
      editedPost.businessHeadCode &&
      businesshead.length > 0
    ) {
      const filteredVerticals = vertical.filter(
        (verticals) => verticals.verticalCode === editedPost.verticalCode
      );
      setFilteredverticals(filteredVerticals);
  
      const filteredBusinessHeads = businesshead.filter(
        (businessheads) =>
          businessheads.verticalCode === editedPost.verticalCode &&
          businessheads.businessHeadCode === editedPost.businessHeadCode
      );
      setFilteredbusinessheads(filteredBusinessHeads);
    }
  }, [editedPost, region, vertical, businesshead, regionhead]);

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
      verticalHeadName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      verticalHeadCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      verticalCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      verticalName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      businessHeadCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      businessHeadName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regionCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regionName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regionHeadCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regionHeadName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    setGlobalFilterValue("");
  };

  const downloadCSV = () => {
    // Define the headers for the CSV
    const headers = [
      "Vertical Head Name",
      "vertical Head Code",
      "Vertical Code",
      "Vertical Name",
      "Business Head Code",
      "Business Head Name",
      "Region Code",
      "Region Name",
      "Region Head Code",
      "Region Head Name",
    ];

    // Create an array of rows to be included in the CSV
    const rows = posts.map((post) => [
      post.verticalHeadName,
      post.verticalHeadCode,
      post.verticalCode,
      post.verticalName,
      post.businessHeadCode,
      post.businessHeadName,
      post.regionCode,
      post.regionName,
      post.regionHeadName,
      post.regionHeadCode,
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
      verticalHeadName: "",
      verticalHeadCode: "",
      verticalCode: "",
      verticalName: "",
      businessHeadCode: "",
      businessHeadName: "",
      regionCode: "",
      regionName: "",
      regionHeadName: "",
      regionHeadCode: "",
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
            await axios.post("http://localhost:8800/api/auth/adminverticalhead", row);
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
        Vertical Head
      </p>

      <div>
        <p
          type="button"
          className="Addbuttonuser"
          onClick={() => setShowAdditionaluser(true)}
        >
          <i className="fa fa-plus"></i>Click Here to Create Vertical Head{" "}
        </p>

        <div className={`additional-user ${showAdditionaluser ? "show" : ""}`}>
          <div className="form-container-user">
            <form className="formuser" onSubmit={handleSubmit}>
              <div>
                <label>
                  Vertical Code
                  <select
                    required
                    className="userinput"
                    id="verticalCode"
                    name="verticalCode"
                    value={inputs.verticalCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Vertical Code</option>
                    {vertical.map((verticals) => (
                      <option
                        key={verticals.verticalCode}
                        value={verticals.verticalCode}
                      >
                        {verticals.verticalCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Vertical Name
                  <select
                    className="userinput"
                    id="verticalName"
                    name="verticalName"
                    value={inputs.verticalName || ""}
                    onChange={handleChange}
                    style={{ pointerEvents: "none", appearance: "none" }}
                  >
                    {filteredverticals.map((verticals) => (
                      <option
                        key={verticals.verticalName}
                        value={verticals.verticalName}
                      >
                        {verticals.verticalName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Business Head Name
                  <input
                    type="text"
                    className="userinput"
                    id="businessHeadName"
                    name="businessHeadName"
                    value={inputs.businessHeadName || ""}
                    readOnly
                  />
                </label>
              </div>

              <div>
                <label>
                  Business Head Code
                  <input
                    type="text"
                    className="userinput"
                    id="businessHeadCode"
                    name="businessHeadCode"
                    value={inputs.businessHeadCode || ""}
                    readOnly
                  />
                </label>
              </div>
              <div>
                <label>
                Region Code
                  <select
                    required
                    className="userinput"
                    id="regionCode"
                    name="regionCode"
                    value={inputs.regionCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Region Code</option>
                    {region.map((regions) => (
                      <option
                        key={regions.regionCode}
                        value={regions.regionCode}
                      >
                        {regions.regionCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                Region Name
                  <select
                    className="userinput"
                    id="regionName"
                    name="regionName"
                    value={inputs.regionName || ""}
                    onChange={handleChange}
                    style={{ pointerEvents: "none", appearance: "none" }}
                  >
                    {filteredregions.map((regions) => (
                      <option
                        key={regions.regionName}
                        value={regions.regionName}
                      >
                        {regions.regionName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Region Head Name
                  <select
                    className="userinput"
                    id="regionHeadName"
                    name="regionHeadName"
                    value={inputs.regionHeadName || ""}
                    onChange={handleChange}
                    style={{ pointerEvents: "none", appearance: "none" }}
                  >
                    {filteredregionheads.map((regionhead) => (
                      <option
                        key={regionhead.regionHeadName}
                        value={regionhead.regionHeadName}
                      >
                        {regionhead.regionHeadName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                Region Head Code
                  <select
                    className="userinput"
                    id="regionHeadCode"
                    name="regionHeadCode"
                    value={inputs.regionHeadCode || ""}
                    onChange={handleChange}
                    style={{ pointerEvents: "none", appearance: "none" }}
                  >
                    {filteredregionheads.map((regionhead) => (
                      <option
                        key={regionhead.regionHeadCode}
                        value={regionhead.regionHeadCode}
                      >
                        {regionhead.regionHeadCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Vertical Head code
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="verticalHeadCode"
                    name="verticalHeadCode"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div>
                <label>
                  Vertical Head Name
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="verticalHeadName"
                    name="verticalHeadName"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <button type="submit" className="Submitbuttonuser">
                Submit
              </button>
            </form>
          </div>

          {err && (
            <>
              <div className="popup-background"></div>
              <div className="popup-wrapper">
                <p className="investmsgp">{err.sqlMessage}</p>
                <div className="investmsg-buttons">
                  <a href="/admin/verticalheadmaster">
                    <button
                      className="investmsg-no"
                      onClick={() => setErr(null)}
                    >
                      Close
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
                <a href="/admin/verticalheadmaster">
                  <p className="investmsgclose" onClick={() => setMsg(null)}>
                    close
                  </p>
                </a>
              </div>
            </>
          )}
        
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
        <Column
          field="verticalHeadCode"
          sortable
          header="Vertical Head Code"
        ></Column>
        <Column
          field="verticalHeadName"
          sortable
          header="Vertical Head Name"
        ></Column>
        <Column field="verticalCode" sortable header="Vertical Code"></Column>
        <Column field="verticalName" sortable header="Vertical Name"></Column>
        <Column
          field="businessHeadCode"
          sortable
          header="Business Head Code"
        ></Column>
        <Column
          field="businessHeadName"
          sortable
          header="Business Head Name"
        ></Column>
        <Column field="regionCode" sortable header="Region Code"></Column>
        <Column field="regionName" sortable header="Region Name"></Column>
        <Column
          field="regionHeadCode"
          sortable
          header="Region Head Code"
        ></Column>
        <Column
          field="regionHeadName"
          sortable
          header="Region Head Name"
        ></Column>
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
        header="Update Vertical Head Data"
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
                <label htmlFor="verticalHeadCode">Vertical Head Code</label>
                <InputText
                  id="verticalHeadCode"
                  required
                  value={editedPost.verticalHeadCode}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      verticalHeadCode: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="verticalHeadName">Vertical Head Name</label>
                <InputText
                  id="verticalHeadName"
                  required
                  value={editedPost.verticalHeadName}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      verticalHeadName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="verticalCode">Vertical Code</label>
                <select
                  id="verticalCode"
                  required
                  value={editedPost.verticalCode}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      verticalCode: e.target.value,
                    })
                  }
                  disabled={!editedPost}
                  className="userinput"
                >
                  <option value="">Select Vertical Code</option>
                  {vertical.map((verticals) => (
                    <option key={verticals.verticalCode} value={verticals.verticalCode}>
                      {verticals.verticalCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="verticalName">Vertical Name</label>
                <select
                  id="verticalName"
                  value={editedPost.verticalName}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      verticalName: e.target.value,
                    })
                  }
                  disabled={!editedPost}
                  className="userinput"
                  style={{ pointerEvents: "none", appearance: "none" }}
                >
                  {filteredEditverticals.map((verticals) => (
                    <option key={verticals.verticalName} value={verticals.verticalName}>
                      {verticals.verticalName}
                    </option>
                  ))}
                </select>
              </div>
             

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="businessHeadName">Business Head Name</label>
                <select
                  id="businessHeadName"
                  value={editedPost.businessHeadName}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      businessHeadName: e.target.value,
                    })
                  }
                  disabled={!editedPost}
                  className="userinput"
                  style={{ pointerEvents: "none", appearance: "none" }}
                >
                  {filteredEditbusinessheads.map((businessheads) => (
                    <option key={businessheads.businessHeadName} value={businessheads.businessHeadName}>
                      {businessheads.businessHeadName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="businessHeadCode">Business Head Code</label>
                <select
                  id="businessHeadCode"
                  value={editedPost.businessHeadCode}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      businessHeadCode: e.target.value,
                    })
                  }
                  disabled={!editedPost}
                  className="userinput"
                  style={{ pointerEvents: "none", appearance: "none" }}
                >
                  {filteredEditbusinessheads.map((businessheads) => (
                    <option key={businessheads.businessHeadCode} value={businessheads.businessHeadCode}>
                      {businessheads.businessHeadCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="regionCode">Region Code</label>
                <select
                  id="regionCode"
                  required
                  value={editedPost.regionCode}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      regionCode: e.target.value,
                    })
                  }
                  disabled={!editedPost}
                  className="userinput"
                >
                  <option value="">Select Region Code</option>
                  {region.map((regions) => (
                    <option key={regions.regionCode} value={regions.regionCode}>
                      {regions.regionCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="regionName">Region Name</label>
                <select
                  id="regionName"
                  value={editedPost.regionName}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      regionName: e.target.value,
                    })
                  }
                  disabled={!editedPost}
                  className="userinput"
                  style={{ pointerEvents: "none", appearance: "none" }}
                >
                  {filteredEditregions.map((regions) => (
                    <option key={regions.regionName} value={regions.regionName}>
                      {regions.regionName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="regionHeadName">Region Head Name</label>
                <select
                  id="regionHeadName"
                  value={editedPost.regionHeadName}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      regionHeadName: e.target.value,
                    })
                  }
                  disabled={!editedPost}
                  className="userinput"
                  style={{ pointerEvents: "none", appearance: "none" }}
                >
                  {filteredEditregionheads.map((regionhead) => (
                    <option
                      key={regionhead.regionHeadName}
                      value={regionhead.regionHeadName}
                    >
                      {regionhead.regionHeadName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="regionHeadCode">Region Head Code</label>
                <select
                  id="regionHeadCode"
                  value={editedPost.regionHeadCode}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      regionHeadCode: e.target.value,
                    })
                  }
                  disabled={!editedPost}
                  className="userinput"
                  style={{ pointerEvents: "none", appearance: "none" }}
                >
                  {filteredEditregionheads.map((regionhead) => (
                    <option
                      key={regionhead.regionHeadCode}
                      value={regionhead.regionHeadCode}
                    >
                      {regionhead.regionHeadCode}
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

export default Verticalhead;
