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
import { data } from '../../../constants/admindata'
import UserInfo from '../../../Components/Admin/user-info/UserInfo'

import "./Branch.css";

const Branch = () => {
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
        branchcode: "",
        branchname: "",
    });

    const handleChange = (e) => {
        setInputs((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8800/api/auth/adminbranch",
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
        axios.get("http://localhost:8800/api/auth/branchdata").then((res) => {
            setPosts(res.data);
        });
    }, []);

    const saveEditedPost = () => {
        axios
            .put(
                `http://localhost:8800/api/auth/editbranch/${editedPost.id}`,
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
            regioncode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            branchcode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            branchname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },

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
        { id: "", regionname: "", regioncode: "", branchname: "", branchcode: "" }
    ]

    const handleFileUpload = (file) => {
        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                const { data } = results;
                const filteredData = data.filter(row => {
                    // Check if all values in the row are empty or not
                    return Object.values(row).some(value => value.trim() !== '');
                });
                for (let i = 0; i < filteredData.length; i++) {
                    const row = filteredData[i];
                    try {
                        await axios.post(
                            "http://localhost:8800/api/auth/adminbranch",
                            row
                        );
                        console.log(`Inserted row ${i + 1}: ${JSON.stringify(row)}`);
                    } catch (err) {
                        console.error(`Error inserting row ${i + 1}: ${JSON.stringify(row)}`);
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
            <div className='suser'>
                <UserInfo user={data.user} />
            </div>
            <p
                style={{
                    fontSize: "20px",
                }}
            >
                Branch
            </p>
            <div className="form-container-branch">
                <form className="formbranch" onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Region Name
                            <input
                                required
                                autoComplete="off"
                                className="branchinput"
                                id="regionname"
                                name="regionname"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Region Code
                            <input
                                required
                                autoComplete="off"
                                className="branchinput"
                                id="regioncode"
                                name="regioncode"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Branch Name
                            <input
                                required
                                autoComplete="off"
                                className="branchinput"
                                id="branchname"
                                name="branchname"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Branch Code
                            <input
                                required
                                autoComplete="off"
                                className="branchinput"
                                id="Branchcode"
                                name="Branchcode"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <button type="submit" className="Submitbuttonbranch">
                        Submit
                    </button>

                   
                </form>

                <input
                        type="file" className="branchfile"
                        onChange={(e) => handleFileUpload(e.target.files[0])}
                    />

                    
                {err && (
                    <>
                        <div className="popup-background"></div>
                        <div className="popup-wrapper">
                            <p className="investmsgp">{err}</p>
                            <div className="investmsg-buttons">
                                <button className="investmsg-yes" onClick={handleSubmit}>
                                    Yes
                                </button>
                                <a href="/adminbranchc">
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
                            <a href="/adminbranch">
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
                    <Button><CSVLink
                        data={samplecsv}
                        filename={"samplebranchdata"}
                        target="_blank"
                    >Sample</CSVLink></Button>
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
                <Column field="regionname" sortable header="Region Name"></Column>
                <Column field="regioncode" sortable header="Region Code"></Column>
                <Column field="branchname" sortable header="Branch Name"></Column>
                <Column field="branchcode" sortable header="Branch Code"></Column>
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
                                <label htmlFor="branchname">Branch Name</label>
                                <InputText
                                    id="branchname"
                                    value={editedPost.branchname}
                                    onChange={(e) =>
                                        setEditedPost({ ...editedPost, branchcode: e.target.value })
                                    }
                                />
                            </div>
                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="branchcode">Branch Code</label>
                                <InputText
                                    id="branchcode"
                                    value={editedPost.branchcode}
                                    onChange={(e) =>
                                        setEditedPost({ ...editedPost, branchcode: e.target.value })
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

export default Branch;