import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { data } from '../../../constants/admindata'
import UserInfo from '../../../Components/Admin/user-info/UserInfo'
import "./vertical.css";

const Vertical = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editedPost, setEditedPost] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  // const [addColumnDialogVisible, setAddColumnDialogVisible] = useState(false);
  // const [newColumnName, setNewColumnName] = useState("");
  // const [newVerticalName, setNewVerticalName] = useState("");
  const [showAdditionalregion, setShowAdditionalregion] = useState(false);


  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const [inputs, setInputs] = useState({
    verticalName: "",
    verticalCode: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.toUpperCase(),
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/adminvertical",
        {
          ...inputs,
          verticalName: inputs.verticalName.toUpperCase(),
          verticalCode: inputs.verticalCode.toUpperCase(),
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
    axios.get("http://localhost:8800/api/auth/verticaldata").then((res) => {
      setPosts(res.data);
    });
  }, []);

  const saveEditedPost = () => {
    axios
      .put(
        `http://localhost:8800/api/auth/editvertical/${editedPost.id}`,
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

  // const addNewColumn = () => {
  //   // Call the API endpoint to add a new column
  //   axios
  //     .post("http://localhost:8800/api/auth/adminvertical", {
  //       columnname: newColumnName,
  //       verticalname: newVerticalName,
  //     })
  //     .then((res) => {
  //       setAddColumnDialogVisible(false);
  //       setNewColumnName("");
  //       setNewVerticalName("");
  //       alert("You have added a new column.");
  //     })
  //     .catch((error) => console.log(error));
  // };

  return (
    <div className="form">
        <div className='suser'>
                <UserInfo user={data.user} />
        </div>
      <p
        style={{
          fontSize: "20px",
          textAlign: "left",
        }}
      >
        VERTICAL
      </p>

      <p
        type="button"
        className="Addbuttonregion"
        onClick={() => setShowAdditionalregion(true)}
      >
        <i className="fa fa-plus"></i>Click Here to Create Region{" "}
      </p>

      <div className={`additional-region ${showAdditionalregion ? "show" : ""}`}>
        <div className="form-container-region">
          <form className="formregion" onSubmit={handleSubmit}>
            <div>
              <label>
                Vertical Name
                <input
                  autoComplete="off"
                  required
                  className="regioninput"
                  id="verticalName"
                  name="verticalName"
                  onChange={handleChange}
                  style={{ textTransform: "uppercase" }}
                />
              </label>
            </div>

            <div>
              <label>
                Vertical Code
                <input
                  required
                  autoComplete="off"
                  className="regioninput"
                  id="verticalCode"
                  name="verticalCode"
                  onChange={handleChange}
                  style={{ textTransform: "uppercase" }}
                />
              </label>
            </div>

            <button type="submit" className="Submitbuttonregion">
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
                  <a href="/admin/verticalmaster">
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
                <a href="/admin/verticalmaster">
                  <p className="investmsgclose" onClick={() => setMsg(null)}>
                    close
                  </p>
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      <DataTable
        value={posts}
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
        <Column field="verticalName" sortable header="Vertical Name"></Column>
        <Column field="verticalCode" sortable header="Vertical Code"></Column>
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
        {/* <Column
          body={(rowData) => (
        <Button
                label="Add Column"
                icon="pi pi-plus"
                onClick={() => setAddColumnDialogVisible(true)}
              />
            )}
        /> */}
      </DataTable>
      <Dialog
        header="Update Vertical Data"
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
                <label htmlFor="verticalName">Vertical Name</label>
                <InputText
                  id="verticalName"
                  value={editedPost.verticalName}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      verticalName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="verticalCode">Vertical Code</label>
                <InputText
                  id="verticalCode"
                  value={editedPost.verticalCode}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      verticalCode: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <Button label="Save" icon="pi pi-check" onClick={saveEditedPost} />
          </div>
        )}
      </Dialog>
      {/* <Dialog
        header="Add Column"
        visible={addColumnDialogVisible}
        style={{ width: "50vw" }}
        modal
        onHide={() => {
          setAddColumnDialogVisible(false);
          setNewColumnName("");
          setNewVerticalName("");
        }}
        className="my-dialog"
      >
        <div className="p-fluid">
          <div className="p-field" style={{ paddingBottom: "10px" }}>
            <label htmlFor="columnname">Column Name</label>
            <InputText
              id="columnname"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
          </div>
          <div className="p-field" style={{ paddingBottom: "10px" }}>
            <label htmlFor="verticalname">Vertical Name</label>
            <InputText
              id="verticalname"
              value={newVerticalName}
              onChange={(e) => setNewVerticalName(e.target.value)}
            />
          </div>
        </div>
        <Button
          label="Submit"
          icon="pi pi-check"
          onClick={addNewColumn}
        />
      </Dialog> */}
    </div>
  );
};

export default Vertical;
