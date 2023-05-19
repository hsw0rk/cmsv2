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
import "./User.css";
import { data } from "../../../constants/admindata";
import UserInfo from "../../../Components/Admin/user-info/UserInfo";

const Principal = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});
  const [editedPost, setEditedPost] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const [inputs, setInputs] = useState({
    employeename: "",
    employeecode: "",
    mobilenumber: "",
    // password: "",
    regionCode: "",
    regionName: "",
    branchName: "",
    branchCode: "",
    branchName2: "",
    branchCode2: "",
    branchName3: "",
    branchCode3: "",
    branchName4: "",
    branchCode4: "",
    branchName5: "",
    branchCode5: "",
  });

  const [branches, setBranches] = useState([]);
  const [branchesadd, setBranchesadd] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [filteredbranchCodes, setFilteredbranchCodes] = useState([]);
  const [showAdditionaluser, setShowAdditionaluser] = useState(false);


  useEffect(() => {
    const fetchBranchesadd = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getbranchadd"
      );
      setBranchesadd(res.data);
    };
    fetchBranchesadd();
  }, []);




  useEffect(() => {
    const fetchBranches = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getbranchinuser"
      );
      setBranches(res.data);
    };
    const fetchRegions = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getregioninuser"
      );
      setRegions(res.data);
    };
    fetchBranches();
    fetchRegions();
  }, []);

  useEffect(() => {
    if (inputs.regionCode) {
      const filteredRegions = regions.filter(
        (region) => region.regionCode === inputs.regionCode
      );
      setFilteredRegions(filteredRegions);

      const filteredBranches = branches.filter(
        (branch) => branch.regionCode === inputs.regionCode
      );
      setFilteredBranches(filteredBranches);

      const filteredbranchCodes = branches.filter(
        (branch) =>
          branch.regionCode === inputs.regionCode &&
          branch.branchName === inputs.branchName &&
          branch.branchCode !== inputs.branchCode
      );
      setFilteredbranchCodes(filteredbranchCodes);
    } else {
      setFilteredRegions([]);
      setFilteredBranches([]);
      setFilteredbranchCodes([]);
    }
  }, [inputs.regionCode, inputs.branchName, inputs.branchCode, regions, branches]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    if (name === 'regionCode') {
      const selectedRegion = regions.find(
        (region) => region.regionCode === value
      );
      console.log('selectedRegion:', selectedRegion);
      setInputs((prevInputs) => ({
        ...prevInputs,
        regionName: selectedRegion ? selectedRegion.regionName : '',
      }));
    }

    if (name === 'branchName') {
      const selectedBranch = branches.find(
        (branch) =>
          branch.regionCode === inputs.regionCode && branch.branchName === value
      );
      console.log('selectedBranch:', selectedBranch);
      setInputs((prevInputs) => ({
        ...prevInputs,
        branchCode: selectedBranch ? selectedBranch.branchCode : '',
      }));
    }

    if (name === 'branchName2') {
      const selectedBranch2 = branchesadd.find(
        (branch) =>
          branch.regionCode === inputs.regionCode && branch.branchName2 === value
      );
      console.log('selectedBranch2:', selectedBranch2);
      setInputs((prevInputs) => ({
        ...prevInputs,
        branchCode2: selectedBranch2 ? selectedBranch2.branchCode2 : '',
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/adminuser",
        { ...inputs }
      );
      setMsg(response.data);
      setErr(null);
    } catch (err) {
      setErr(err.response.data);
      setMsg(null);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8800/api/auth/userdata").then((res) => {
      setPosts(res.data);
    });
  }, []);

  const saveEditedPost = () => {
    axios
      .put(
        `http://localhost:8800/api/auth/edituser/${editedPost.id}`,
        editedPost
      )
      .then((res) => {
        setPosts(
          posts.map((post) => (post.id === editedPost.id ? editedPost : post))
        );
        setEditedPost(null);
        setEditDialogVisible(false);
        alert("You have edited the data.");
      })
      .catch((error) => console.log(error));
  };

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
      employeename: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      employeecode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      mobilenumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      // password: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regionCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regionName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName2: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode2: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName3: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode3: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName4: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode4: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName5: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode5: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
    link.setAttribute("download", "usermaster.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const samplecsv = [
    {
      id: "",
      employeename: "",
      employeecode: "",
      mobilenumber: "",
      // password: "",
      regionCode: "",
      regionName: "",
      branchName: "",
      branchCode: "",
      branchName2: "",
      branchCode2: "",
      branchName3: "",
      branchCode3: "",
      branchName4: "",
      branchCode4: "",
      branchName5: "",
      branchCode5: "",
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
            await axios.post("http://localhost:8800/api/auth/adminuser", row);
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
        User
      </p>

      <p
        type="button"
        className="Addbuttonuser"
        onClick={() => setShowAdditionaluser(true)}
      >
        <i className="fa fa-plus"></i>Click Here to Create User{" "}
      </p>

      <div className={`additional-user ${showAdditionaluser ? "show" : ""}`}>
        <div className="form-container-user">
          <form className="formuser" onSubmit={handleSubmit}>
            <div>
              <label>
                Employee Name
                <input
                  required
                  className="userinput"
                  id="employeename"
                  name="employeename"
                  onChange={handleChange}
                />
              </label>
            </div>

            <div>
              <label>
                Employee Code
                <input
                  required
                  className="userinput"
                  id="employeecode"
                  name="employeecode"
                  onChange={handleChange}
                />
              </label>
            </div>

            <div>
              <label>
                Mobile Number
                <input
                  required
                  className="userinput"
                  id="mobilenumber"
                  name="mobilenumber"
                  onChange={handleChange}
                />
              </label>
            </div>

            {/* <div hidden>
              <label>
                password
                <input
                  required
                  className="userinput"
                  id="password"
                  name="password"
                  onChange={handleChange}
                />
              </label>
            </div> */}

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
                  {regions.map((region) => (
                    <option key={region.regionCode} value={region.regionCode}>
                      {region.regionCode}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div hidden>
              <label>
                Region Name
                <select
                  className="userinput"
                  id="regionName"
                  name="regionName"
                  value={inputs.regionName || ""}
                  onChange={handleChange}
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
                <select
                  required
                  className="userinput"
                  id="branchName"
                  name="branchName"
                  value={inputs.branchName || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Branch Name</option>
                  {filteredBranches.map((branch) => (
                    <option key={branch.branchName} value={branch.branchName}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div hidden>
              <label>
                Branch Code
                <select

                  className="userinput"
                  id="branchCode"
                  name="branchCode" // update name attribute to "branchCode"
                  value={inputs.branchCode || ""}
                  onChange={handleChange}
                >
                  {filteredbranchCodes.map((branch) => (
                    <option key={branch.branchCode} value={branch.branchCode}>
                      {branch.branchCode}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button type="submit" className="Submitbuttonuser">
              Submit
            </button>
          </form>
        </div>



        <div>
          <label>
            Branch Name 2
            <select
              required
              className="userinput"
              id="branchName2"
              name="branchName2"
              value={inputs.branchName2 || ""}
              onChange={handleChange}
            >
              <option value="">Select Branch Name 2</option>
              {filteredBranches.map((branch) => (
                <option key={branch.branchName} value={branch.branchName}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </label>
        </div>


        <div >
          <label>
            Branch Code 2
            <select

              className="userinput"
              id="branchCode2"
              name="branchCode2" // update name attribute to "branchCode"
              value={inputs.branchCode2 || ""}
              onChange={handleChange}
            >
              {filteredbranchCodes.map((branch) => (
                <option key={branch.branchCode} value={branch.branchCode}>
                  {branch.branchCode}
                </option>
              ))}
            </select>
          </label>
        </div>






        <input
          type="file"
          className="userfile"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          style={{ flex: "" }}
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
          <Button style={{ flex: "" }}>
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
              flex: "",
              marginRight: "0px",
              backgroundColor: "lightgreen",
              border: "none",
            }}
            title="Download CSV"
          />
        </div>

        {err && (
          <>
            <div className="popup-background"></div>
            <div className="popup-wrapper">
              <p className="investmsgp">{err}</p>
              <div className="investmsg-buttons">
                <a href="/admin/usermaster">
                  <button className="investmsg-no" onClick={() => setErr(null)}>
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
              <a href="/admin/usermaster">
                <p className="investmsgclose" onClick={() => setMsg(null)}>
                  close
                </p>
              </a>
            </div>
          </>
        )}
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
        <Column field="employeename" sortable header="Employee Name"></Column>
        <Column field="employeecode" sortable header="Employee Code"></Column>
        <Column field="mobilenumber" sortable header="Mobile Number"></Column>
        <Column field="regionName" sortable header="Region Name"></Column>
        <Column field="regionCode" sortable header="Region Code"></Column>
        <Column field="branchName" sortable header="Branch Name 1"></Column>
        <Column field="branchCode" sortable header="Branch Code 1"></Column>
        <Column field="branchCode2" sortable header="Branch Name 2"></Column>
        <Column field="branchCode2" sortable header="Branch Code 2"></Column>
        <Column field="branchCode3" sortable header="Branch Name 3"></Column>
        <Column field="branchCode3" sortable header="Branch Code 3"></Column>
        <Column field="branchCode4" sortable header="Branch Name 4"></Column>
        <Column field="branchCode4" sortable header="Branch Code 4"></Column>
        <Column field="branchCode5" sortable header="Branch Name 5"></Column>
        <Column field="branchCode5" sortable header="Branch Code 5"></Column>

        <Column
          body={(rowData) => (
            <Button
              label="Edit"
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
        header="Edit Post"
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
                <label htmlFor="employeename">Employee Name</label>
                <InputText
                  id="employeename"
                  value={editedPost.employeename}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      employeename: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="employeecode">Employee Code</label>
                <InputText
                  id="employeecode"
                  value={editedPost.employeecode}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      employeecode: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="mobilenumber">Mobile Number</label>
                <InputText
                  id="mobilenumber"
                  value={editedPost.mobilenumber}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      mobilenumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="regionCode">Region Code</label>
                <InputText
                  id="regionCode"
                  value={editedPost.regionCode}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, regionCode: e.target.value })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="regionName">Region Name</label>
                <InputText
                  id="regionName"
                  value={editedPost.regionName}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, regionName: e.target.value })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchName">Branch Name 1</label>
                <InputText
                  id="branchName"
                  value={editedPost.branchName}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchCode">Branch Code 1</label>
                <InputText
                  id="branchCode"
                  value={editedPost.branchCode}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchCode: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchName2">Branch Name 2</label>
                <InputText
                  id="branchName2"
                  value={editedPost.branchName2}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchName2: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchCode2">Branch Code 2</label>
                <InputText
                  id="branchCode2"
                  value={editedPost.branchCode2}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchCode2: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchName3">Branch Name 3</label>
                <InputText
                  id="branchName3"
                  value={editedPost.branchName3}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchName3: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchCode3">Branch Code 3</label>
                <InputText
                  id="branchCode3"
                  value={editedPost.branchCode3}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchCode3: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchName4">Branch Name 4</label>
                <InputText
                  id="branchName4"
                  value={editedPost.branchName4}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchName4: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchCode4">Branch Code 4</label>
                <InputText
                  id="branchCode4"
                  value={editedPost.branchCode4}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchCode4: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchName5">Branch Name 5</label>
                <InputText
                  id="branchName5"
                  value={editedPost.branchName5}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchName5: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchCode5">Branch Code 5</label>
                <InputText
                  id="branchCode5"
                  value={editedPost.branchCode5}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchCode5: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <Button label="Save" icon="pi pi-check" onClick={saveEditedPost} />
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Principal;
