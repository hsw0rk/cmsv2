import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { data } from '../../../constants/admindata'
import UserInfo from '../../../Components/Admin/user-info/UserInfo'
import "./product.css";

const Product = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editedPost, setEditedPost] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8800/api/auth/productdata").then((res) => {
      setPosts(res.data);
    });
  }, []);

  const saveEditedPost = () => {
    axios
      .put(
        `http://localhost:8800/api/auth/editproduct/${editedPost.id}`,
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


  return (
    <div className="form">
        <div className='suser'>
                <UserInfo user={data.user} />
        </div>
      <p
        style={{
          fontSize: "20px",
        }}
      >
        PRODUCT
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
        <Column field="productininvestments" sortable header="Investments"></Column>
        <Column field="productinhomeloans" sortable header="Home loans"></Column>
        <Column field="productininsurance" sortable header="Insurance"></Column>
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
                <label htmlFor="productininvestments">Investments</label>
                <InputText
                  id="productininvestments"
                  value={editedPost.productininvestments}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, productininvestments: e.target.value })
                  }
                />
              </div>
              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="productinhomeloans">Home loans</label>
                <InputText
                  id="productinhomeloans"
                  value={editedPost.productinhomeloans}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, productinhomeloans: e.target.value })
                  }
                />
              </div>
              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="productininsurance">Insurance</label>
                <InputText
                  id="productininsurance"
                  value={editedPost.productininsurance}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, productininsurance: e.target.value })
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

export default Product;
