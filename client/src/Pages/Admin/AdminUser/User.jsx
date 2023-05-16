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

  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const [inputs, setInputs] = useState({
    employeename: "",
    employeecode: "",
    mobilenumber: "",
    // password: "",
    regioncode: "",
    regionname: "",
    branchname: "",
    branchcode: "",
    Branchname2: "",
    Branchcode2: "",
    Branchname3: "",
    Branchcode3: "",
    Branchname4: "",
    Branchcode4: "",
    Branchname5: "",
    Branchcode5: "",
  });

  const [branches, setBranches] = useState([]);
  const [branchesadd, setBranchesadd] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [filteredBranchCodes, setFilteredBranchCodes] = useState([]);
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
    if (inputs.regioncode) {
      const filteredRegions = regions.filter(
        (region) => region.regioncode === inputs.regioncode
      );
      setFilteredRegions(filteredRegions);

      const filteredBranches = branches.filter(
        (branch) => branch.regioncode === inputs.regioncode
      );
      setFilteredBranches(filteredBranches);

      const filteredBranchCodes = branches.filter(
        (branch) =>
          branch.regioncode === inputs.regioncode &&
          branch.branchname === inputs.branchname &&
          branch.branchcode !== inputs.branchcode
      );
      setFilteredBranchCodes(filteredBranchCodes);
    } else {
      setFilteredRegions([]);
      setFilteredBranches([]);
      setFilteredBranchCodes([]);
    }
  }, [inputs.regioncode, inputs.branchname, inputs.branchcode, regions, branches]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    if (name === 'regioncode') {
      const selectedRegion = regions.find(
        (region) => region.regioncode === value
      );
      console.log('selectedRegion:', selectedRegion);
      setInputs((prevInputs) => ({
        ...prevInputs,
        regionname: selectedRegion ? selectedRegion.regionname : '',
      }));
    }

    if (name === 'branchname') {
      const selectedBranch = branches.find(
        (branch) =>
          branch.regioncode === inputs.regioncode && branch.branchname === value
      );
      console.log('selectedBranch:', selectedBranch);
      setInputs((prevInputs) => ({
        ...prevInputs,
        branchcode: selectedBranch ? selectedBranch.branchcode : '',
      }));
    }

    if (name === 'Branchname2') {
      const selectedBranch2 = branchesadd.find(
        (branch) =>
          branch.regioncode === inputs.regioncode && branch.Branchname2 === value
      );
      console.log('selectedBranch2:', selectedBranch2);
      setInputs((prevInputs) => ({
        ...prevInputs,
        Branchcode2: selectedBranch2 ? selectedBranch2.Branchcode2 : '',
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
      regionname: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      employeename: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      employeecode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      mobilenumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      // password: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regioncode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regionname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchcode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
      regioncode: "",
      regionname: "",
      branchname: "",
      branchcode: "",
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
                  id="regioncode"
                  name="regioncode"
                  value={inputs.regioncode || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Region Code</option>
                  {regions.map((region) => (
                    <option key={region.regioncode} value={region.regioncode}>
                      {region.regioncode}
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
                  id="regionname"
                  name="regionname"
                  value={inputs.regionname || ""}
                  onChange={handleChange}
                >
                  {filteredRegions.map((region) => (
                    <option key={region.regionname} value={region.regionname}>
                      {region.regionname}
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
                  id="branchname"
                  name="branchname"
                  value={inputs.branchname || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Branch Name</option>
                  {filteredBranches.map((branch) => (
                    <option key={branch.branchname} value={branch.branchname}>
                      {branch.branchname}
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
                  id="branchcode"
                  name="branchcode" // update name attribute to "branchcode"
                  value={inputs.branchcode || ""}
                  onChange={handleChange}
                >
                  {filteredBranchCodes.map((branch) => (
                    <option key={branch.branchcode} value={branch.branchcode}>
                      {branch.branchcode}
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
              id="Branchname2"
              name="Branchname2"
              value={inputs.Branchname2 || ""}
              onChange={handleChange}
            >
              <option value="">Select Branch Name 2</option>
              {filteredBranches.map((branch) => (
                <option key={branch.branchname} value={branch.branchname}>
                  {branch.branchname}
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
              id="Branchcode2"
              name="Branchcode2" // update name attribute to "branchcode"
              value={inputs.Branchcode2 || ""}
              onChange={handleChange}
            >
              {filteredBranchCodes.map((branch) => (
                <option key={branch.branchcode} value={branch.branchcode}>
                  {branch.branchcode}
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
        <Column field="regionname" sortable header="Region Name"></Column>
        <Column field="regioncode" sortable header="Region Code"></Column>
        <Column field="branchname" sortable header="Branch Name 1"></Column>
        <Column field="branchcode" sortable header="Branch Code 1"></Column>
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
                <label htmlFor="regioncode">Region Code</label>
                <InputText
                  id="regioncode"
                  value={editedPost.regioncode}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, regioncode: e.target.value })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="regionname">Region Name</label>
                <InputText
                  id="regionname"
                  value={editedPost.regionname}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, regionname: e.target.value })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchname">Branch Name 1</label>
                <InputText
                  id="branchname"
                  value={editedPost.branchname}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchname: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="branchcode">Branch Code 1</label>
                <InputText
                  id="branchcode"
                  value={editedPost.branchcode}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      branchcode: e.target.value,
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
