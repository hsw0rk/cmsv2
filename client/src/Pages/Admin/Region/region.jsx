import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import exc from "../../../Assets/exc.svg";
import axios from "axios";
import "./region.css";

const Region = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});
  const [editedPost, setEditedPost] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const [inputs, setInputs] = useState({
      regionname: "",
      regioncode: "",
  });

  
  const handleChange = (e) => {
    setInputs((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
    }));
};


const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(
            "http://localhost:8800/api/auth/adminregion",
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
    axios.get("http://localhost:8800/api/auth/regiondata").then((res) => {
      setPosts(res.data);
    });
  }, []);

  const saveEditedPost = () => {
    axios
      .put(
        `http://localhost:8800/api/auth/editregion/${editedPost.id}`,
        editedPost
      )
      .then((res) => {
        setPosts(
          posts.map((post) => (post.id === editedPost.id ? editedPost : post))
        );
        setEditedPost(null);
        setEditDialogVisible(false);
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
      regioncode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
        <p style={{
                fontSize: "20px"
            }}>Region</p>
            <div className="form-container-region">

                <form className="formregion" onSubmit={handleSubmit}>

                    <div>
                        <label>Region Name<input required className="regioninput" id="regionname"
                            name="regionname" onChange={handleChange} /></label>
                    </div>

                    <div>
                        <label>Region Code<input required className="regioninput" id="regioncode" name="regioncode"
                            onChange={handleChange} /></label>
                    </div>

                    <button type="submit" className="Submitbuttonregion">Submit</button>

                </form>
                {err && (
                    <>
                        <div className="popup-background"></div>
                        <div className="popup-wrapper">
                            <p className="investmsgp">{err}</p>
                            <div className="investmsg-buttons">
                                <button className="investmsg-yes" onClick={handleSubmit}>Yes</button>
                                <a href="/adminregion"><button className="investmsg-no" onClick={() => setErr(null)}>No</button></a>
                            </div>
                        </div>
                    </>
                )}


                {msg && (
                    <>
                        <div className="popup-background"></div>
                        <div className="popup-wrapper">
                            <p className="investmsgp">{msg}</p>
                            <a href="/adminregion"><p className="investmsgclose" onClick={() => setMsg(null)}>close</p></a>
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
        <Column field="regionname" sortable header="regionname"></Column>
        <Column field="regioncode" sortable header="regioncode"></Column>
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
        style={{ width: "50vw"}}
        modal
        onHide={() => setEditDialogVisible(false)}
        className="my-dialog"
      >
        {editedPost && (
          <div>
            <div className="p-fluid">
              <div className="p-field"
              style={{paddingBottom:"10px"}}>
                <label htmlFor="regionname">Region Name</label>
                <InputText
                  id="regionname"
                  value={editedPost.regionname}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, regionname: e.target.value })
                  }
                />
              </div>
              <div className="p-field"
              style={{paddingBottom:"10px"}}>
                <label htmlFor="regioncode">Region Code</label>
                <InputText
                  id="regioncode"
                  value={editedPost.regioncode}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, regioncode: e.target.value })
                  }
                />
              </div>
            </div>
            <Button label="Save" icon="pi pi-check" onClick={saveEditedPost}/>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Region;
