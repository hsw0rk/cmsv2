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

const User = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});
  const [editedPost, setEditedPost] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [showAdditionalBranches, setShowAdditionalBranches] = useState(false);

  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const [inputs, setInputs] = useState({
    employeename: "",
    employeecode: "",
    mobilenumber: "",
    password: "",
    RegionCode: "",
    RegionName: "",
    Branchname1: "",
    Branchcode1: "",
    Branchname2: "",
    Branchcode2: "",
    Branchname3: "",
    Branchcode3: "",
    Branchname4: "",
    Branchcode4: "",
    Branchname5: "",
    Branchcode5: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getbrancheinuser"
      );
      setBranches(res.data);
    };
    fetchBranches();
  }, []);

  const [region, setRegion] = useState([]);

  useEffect(() => {
    const fetchRegion = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getregioninuser"
      );
      setRegion(res.data);
    };
    fetchRegion();
  }, []);

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
      regionname: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      employeename: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      employeecode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      mobilenumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      password: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      RegionCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      RegionName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchname1: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchcode1: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchname2: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchcode2: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchname3: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchcode3: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchname4: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchcode4: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchname5: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchcode5: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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

  const samplecsv = [
    {
      id: "",
      employeename: "",
      employeecode: "",
      mobilenumber: "",
      password: "",
      RegionCode: "",
      RegionName: "",
      Branchname1: "",
      Branchcode1: "",
      Branchname2: "",
      Branchcode2: "",
      Branchname3: "",
      Branchcode3: "",
      Branchname4: "",
      Branchcode4: "",
      Branchname5: "",
      Branchcode5: "",
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
      <div className="form-container-branch">
        <form className="formbranch" onSubmit={handleSubmit}>
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

          <div>
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
          </div>

          <div>
            <label>
              Region Code
              <select
                required
                className="userinput"
                id="RegionCode"
                name="RegionCode"
                onChange={handleChange}
              >
                <option value="">Select Region Code</option>
                {region.map((Region) => (
                  <option key={Region.regioncode} value={Region.regioncode}>
                    {Region.regioncode}
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
                id="RegionName"
                name="RegionName"
                onChange={handleChange}
              >
                <option value="">Select Region Name</option>
                {region.map((Region) => (
                  <option key={Region.regionname} value={Region.regionname}>
                    {Region.regionname}
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
                id="Branchname1"
                name="Branchname1"
                onChange={handleChange}
              >
                <option value="">Select Branch Name</option>
                {branches.map((branch) => (
                  <option key={branch.branchname} value={branch.branchname}>
                    {branch.branchname}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Branch Code
              <select
                required
                className="userinput"
                id="Branchcode1"
                name="Branchcode1"
                onChange={handleChange}
              >
                <option value="">Select Branch Code</option>
                {branches.map((branch) => (
                  <option key={branch.branchcode} value={branch.branchcode}>
                    {branch.branchcode}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" className="Submitbuttonbranch">
            Submit
          </button>
        </form>

        <div
          className={`additional-branches ${showAdditionalBranches ? "show" : ""
            }`}
        >
          <div>
            <label>
              Branch Name 1
              <select
                required
                className="userinput"
                id="Branchname2"
                name="Branchname2"
                onChange={handleChange}
              >
                <option value="">Select Branch Name</option>
                {branches.map((branch) => (
                  <option key={branch.branchname} value={branch.branchname}>
                    {branch.branchname}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Branch Code 1
              <select
                required
                className="userinput"
                id="Branchcode2"
                name="Branchcode2"
                onChange={handleChange}
              >
                <option value="">Select Branch Code</option>
                {branches.map((branch) => (
                  <option key={branch.branchcode} value={branch.branchcode}>
                    {branch.branchcode}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Branch Name 2
              <select
                required
                className="userinput"
                id="Branchname3"
                name="Branchname3"
                onChange={handleChange}
              >
                <option value="">Select Branch Name</option>
                {branches.map((branch) => (
                  <option key={branch.branchname} value={branch.branchname}>
                    {branch.branchname}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Branch Code 2
              <select
                required
                className="userinput"
                id="Branchcode3"
                name="Branchcode3"
                onChange={handleChange}
              >
                <option value="">Select Branch Code</option>
                {branches.map((branch) => (
                  <option key={branch.branchcode} value={branch.branchcode}>
                    {branch.branchcode}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Branch Name 3
              <select
                required
                className="userinput"
                id="Branchname4"
                name="Branchname4"
                onChange={handleChange}
              >
                <option value="">Select Branch Name</option>
                {branches.map((branch) => (
                  <option key={branch.branchname} value={branch.branchname}>
                    {branch.branchname}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Branch Code 3
              <select
                required
                className="userinput"
                id="Branchcode4"
                name="Branchcode4"
                onChange={handleChange}
              >
                <option value="">Select Branch Code</option>
                {branches.map((branch) => (
                  <option key={branch.branchcode} value={branch.branchcode}>
                    {branch.branchcode}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Branch Name 4
              <select
                required
                className="userinput"
                id="Branchname5"
                name="Branchname5"
                onChange={handleChange}
              >
                <option value="">Select Branch Name</option>
                {branches.map((branch) => (
                  <option key={branch.branchname} value={branch.branchname}>
                    {branch.branchname}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Branch Code 4
              <select
                required
                className="userinput"
                id="Branchcode5"
                name="Branchcode5"
                onChange={handleChange}
              >
                <option value="">Select Branch Code</option>
                {branches.map((branch) => (
                  <option key={branch.branchcode} value={branch.branchcode}>
                    {branch.branchcode}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Repeat the above two blocks for each additional branch */}
        </div>

        <p
          type="button"
          className="Addbuttonbranch"
          onClick={() => setShowAdditionalBranches(true)}
        >
          <i className="fa fa-plus"></i> Add Branch Name &amp; Branch Code
        </p>

        <input
          type="file"
          className="branchfile"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />

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
        <div className="flex align-items-end justify-content-end gap-2 exc">
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
        <Column field="RegionName" sortable header="Region Name"></Column>
        <Column field="RegionCode" sortable header="Region Code"></Column>
        <Column field="Branchname1" sortable header="Branch Name 1"></Column>
        <Column field="Branchcode1" sortable header="Branch Code 1"></Column>
        <Column field="Branchcode2" sortable header="Branch Name 2"></Column>
        <Column field="Branchcode2" sortable header="Branch Code 2"></Column>
        <Column field="Branchcode3" sortable header="Branch Name 3"></Column>
        <Column field="Branchcode3" sortable header="Branch Code 3"></Column>
        <Column field="Branchcode4" sortable header="Branch Name 4"></Column>
        <Column field="Branchcode4" sortable header="Branch Code 4"></Column>
        <Column field="Branchcode5" sortable header="Branch Name 5"></Column>
        <Column field="Branchcode5" sortable header="Branch Code 5"></Column>

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
                <label htmlFor="RegionCode">Region Code</label>
                <InputText
                  id="RegionCode"
                  value={editedPost.RegionCode}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, RegionCode: e.target.value })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="RegionName">Region Name</label>
                <InputText
                  id="RegionName"
                  value={editedPost.RegionName}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, RegionName: e.target.value })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="Branchname1">Branch Name 1</label>
                <InputText
                  id="Branchname1"
                  value={editedPost.Branchname1}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      Branchname1: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="Branchcode1">Branch Code 1</label>
                <InputText
                  id="Branchcode1"
                  value={editedPost.Branchcode1}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      Branchcode1: e.target.value,
                    })
                  }
                />
              </div>


              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="Branchname2">Branch Name 2</label>
                <InputText
                  id="Branchname2"
                  value={editedPost.Branchname2}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      Branchname2: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="Branchcode2">Branch Code 2</label>
                <InputText
                  id="Branchcode2"
                  value={editedPost.Branchcode2}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      Branchcode2: e.target.value,
                    })
                  }
                />
              </div>


              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="Branchname3">Branch Name 3</label>
                <InputText
                  id="Branchname3"
                  value={editedPost.Branchname3}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      Branchname3: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="Branchcode3">Branch Code 3</label>
                <InputText
                  id="Branchcode3"
                  value={editedPost.Branchcode3}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      Branchcode3: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="Branchname4">Branch Name 4</label>
                <InputText
                  id="Branchname4"
                  value={editedPost.Branchname4}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      Branchname4: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="Branchcode4">Branch Code 4</label>
                <InputText
                  id="Branchcode4"
                  value={editedPost.Branchcode4}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      Branchcode4: e.target.value,
                    })
                  }
                />
              </div>


              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="Branchname5">Branch Name 5</label>
                <InputText
                  id="Branchname5"
                  value={editedPost.Branchname5}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      Branchname5: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="Branchcode5">Branch Code 5</label>
                <InputText
                  id="Branchcode5"
                  value={editedPost.Branchcode5}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      Branchcode5: e.target.value,
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

export default User;