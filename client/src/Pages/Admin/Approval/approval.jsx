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
import { CSVLink } from "react-csv"
import "./Approval.css";

const Approval = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editedPost, setEditedPost] = useState(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);

    const handleApproval = (rowData) => {
        // Populate the form with the row data
        const form = document.getElementById("approval-form");
        form.elements.employeename.value = rowData.employeename;
        form.elements.employeecode.value = rowData.employeecode;
        form.elements.mobilenumber.value = rowData.mobilenumber;
        form.elements.password.value = rowData.password;
        form.elements.RegionCode.value = rowData.RegionCode;
        form.elements.RegionName.value = rowData.RegionName;
        form.elements.Branchname1.value = rowData.Branchname1;
        form.elements.Branchcode1.value = rowData.Branchcode1;

        // Submit the form to insert the row into the usermaster table
        fetch('http://localhost:8800/api/auth/adminapproval', {
            method: 'POST',
            body: new FormData(form)
        })
            .then(response => response.json())
            .then(data => {
                // Show an alert message
                alert('User data has been submitted successfully!');
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });

        // Submit the form
        form.submit();
    };




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
                        <>
                            <Button
                                label="Edit"
                                icon="pi pi-pencil"
                                onClick={() => {
                                    setEditedPost(rowData);
                                    setEditDialogVisible(true);
                                }}
                            />
                            <Button
                                label="Approve"
                                icon="pi pi-check"
                                onClick={() => handleApproval(rowData)}
                            />
                        </>
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
                        <Button label="Save" icon="pi pi-check" onClick={saveEditedPost} />
                    </div>
                )}
            </Dialog>
            <form id="approval-form" onSubmit={(e) => e.preventDefault()}>
                <input type="text" id="employeename-input" name="employeename" />
                <input type="text" id="employeecode-input" name="employeecode" />
                <input type="text" id="mobilenumber-input" name="mobilenumber" />
                <input type="text" id="password-input" name="password" />
                <input type="text" id="RegionCode-input" name="RegionCode" />
                <input type="text" id="RegionName-input" name="RegionName" />
                <input type="text" id="Branchname1-input" name="Branchname1" />
                <input type="text" id="Branchcode1-input" name="Branchcode1" />
            </form>


        </div>


    );
};

export default Approval;