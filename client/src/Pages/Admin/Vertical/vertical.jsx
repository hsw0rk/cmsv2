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
  const [addColumnDialogVisible, setAddColumnDialogVisible] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newVerticalName, setNewVerticalName] = useState("");

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

  const addNewColumn = () => {
    // Call the API endpoint to add a new column
    axios
      .post("http://localhost:8800/api/auth/adminvertical", {
        columnname: newColumnName,
        verticalname: newVerticalName,
      })
      .then((res) => {
        setAddColumnDialogVisible(false);
        setNewColumnName("");
        setNewVerticalName("");
        alert("You have added a new column.");
      })
      .catch((error) => console.log(error));
  };

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
        <Column field="investmentsvt" sortable header="Investments"></Column>
        <Column field="homeloansvt" sortable header="Home loans"></Column>
        <Column field="insurancevt" sortable header="Insurance"></Column>
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
        <Column
          body={(rowData) => (
        <Button
                label="Add Column"
                icon="pi pi-plus"
                onClick={() => setAddColumnDialogVisible(true)}
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
                <label htmlFor="investmentsvt">Investments</label>
                <InputText
                  id="investmentsvt"
                  value={editedPost.investmentsvt}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      investmentsvt: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="homeloansvt">Home loans</label>
                <InputText
                  id="homeloansvt"
                  value={editedPost.homeloansvt}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      homeloansvt: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="insurancevt">Insurance</label>
                <InputText
                  id="insurancevt"
                  value={editedPost.insurancevt}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      insurancevt: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <Button label="Save" icon="pi pi-check" onClick={saveEditedPost} />
          </div>
        )}
      </Dialog>
      <Dialog
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
      </Dialog>
    </div>
  );
};

export default Vertical;
