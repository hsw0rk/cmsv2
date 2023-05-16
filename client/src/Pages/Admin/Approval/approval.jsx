import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import "./Approval.css";
import { data } from '../../../constants/admindata'
import UserInfo from '../../../Components/Admin/user-info/UserInfo'

const Approval = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editedPost, setEditedPost] = useState(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8800/api/auth/approvaldata").then((res) => {
            setPosts(res.data);
        });
    }, []);

    const saveEditedPost = () => {
        axios
            .put(
                `http://localhost:8800/api/auth/editapproval/${editedPost.id}`,
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
                Approval
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
                <Column field="employeename" sortable header="Employee Name"></Column>
                <Column field="employeecode" sortable header="Employee Code"></Column>
                <Column field="mobilenumber" sortable header="Mobile Number"></Column>
                <Column field="RegionName" sortable header="Region Name"></Column>
                <Column field="RegionCode" sortable header="Region Code"></Column>
                <Column field="Branchname1" sortable header="Branch Name 1"></Column>
                <Column field="Branchcode1" sortable header="Branch Code 1"></Column>
                <Column
                    body={(rowData) => (
        
                            <Button
                            style={{margin:'15px'}}
                                label="Approve"
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
                                        setEditedPost({ ...editedPost, employeename: e.target.value })
                                    }
                                />
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="employeecode">Employee Code</label>
                                <InputText
                                    id="employeecode"
                                    value={editedPost.employeecode}
                                    onChange={(e) =>
                                        setEditedPost({ ...editedPost, employeecode: e.target.value })
                                    }
                                />
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="mobilenumber">Mobile Number</label>
                                <InputText
                                    id="mobilenumber"
                                    value={editedPost.mobilenumber}
                                    onChange={(e) =>
                                        setEditedPost({ ...editedPost, mobilenumber: e.target.value })
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
                                <label htmlFor="Branchname1">Branch Name </label>
                                <InputText
                                    id="Branchname1"
                                    value={editedPost.Branchname1}
                                    onChange={(e) =>
                                        setEditedPost({ ...editedPost, Branchname1: e.target.value })
                                    }
                                />
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="Branchcode1">Branch Code</label>
                                <InputText
                                    id="Branchcode1"
                                    value={editedPost.Branchcode1}
                                    onChange={(e) =>
                                        setEditedPost({ ...editedPost, Branchcode1: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <Button label="Approve" icon="pi pi-check" onClick={saveEditedPost} />
                    </div>
                )}
            </Dialog>

        </div>


    );
};

export default Approval;