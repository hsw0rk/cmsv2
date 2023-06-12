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
    const [region, setregion] = useState([]);
    const [regionhead, setregionhead] = useState([]);
    const [branches, setBranches] = useState([]);
    const [vertical, setvertical] = useState([]);
    const [verticalhead, setverticalhead] = useState([]);
    const [businesshead, setbusinesshead] = useState([]);
    
    const [filteredEditverticals, setFilteredEditverticals] = useState([]);
    const [filteredEditverticalheads, setFilteredEditverticalheads] = useState([]);
    const [filteredEditbusinessheads, setFilteredEditbusinessheads] = useState([]);
    const [filteredEditregions, setFilteredEditregions] = useState([]);
    const [filteredEditbranches, setFilteredEditbranches] = useState([]);
    const [filteredEditbranchCodes, setFilteredEditbranchCodes] = useState([]);
    const [filteredEditregionheads, setFilteredEditregionheads] = useState([]);

    useEffect(() => {
        const fetchregion = async () => {
            const res = await axios.get(
                "http://localhost:8800/api/auth/getregioninuser"
            );
            setregion(res.data);
        };

        const fetchregionhead = async () => {
            const res = await axios.get(
                "http://localhost:8800/api/auth/getregionheadinuser"
            );
            setregionhead(res.data);
        };

        const fetchbranch = async () => {
            const res = await axios.get(
                "http://localhost:8800/api/auth/getbranchinuser"
            );
            setBranches(res.data);
        };

        const fetchvertical = async () => {
            const res = await axios.get(
                "http://localhost:8800/api/auth/getverticalinuser"
            );
            setvertical(res.data);
        };

        const fetchverticalhead = async () => {
            const res = await axios.get(
                "http://localhost:8800/api/auth/getverticalheadinuser"
            );
            setverticalhead(res.data);
        };

        const fetchbusiness = async () => {
            const res = await axios.get(
                "http://localhost:8800/api/auth/getbusinessinuser"
            );
            setbusinesshead(res.data);
        };

        fetchregion();
        fetchbranch();
        fetchregionhead();
        fetchvertical();
        fetchverticalhead();
        fetchbusiness();
    }, []);


    useEffect(() => {
        axios.get("http://localhost:8800/api/auth/approvaldata").then((res) => {
            setPosts(res.data);
        });
    }, []);


    useEffect(() => {
        if (editedPost && editedPost.verticalCode) {
            const filteredverticals = vertical.filter(
                (verticals) => verticals.verticalCode === editedPost.verticalCode
            );
            setFilteredEditverticals(filteredverticals);

            const filteredverticalheads = verticalhead.filter(
                (verticalheads) =>
                    verticalheads.verticalCode === editedPost.verticalCode
            );
            setFilteredEditverticalheads(filteredverticalheads);

            const filteredbusinessheads = businesshead.filter(
                (businessheads) =>
                    businessheads.verticalCode === editedPost.verticalCode
            );
            setFilteredEditbusinessheads(filteredbusinessheads);
        } else {
            setFilteredEditverticals([]);
            setFilteredEditverticalheads([]);
            setFilteredEditbusinessheads([]);
        }

        if (editedPost && editedPost.regionCode) {
            const filteredregions = region.filter(
                (regions) => regions.regionCode === editedPost.regionCode
            );
            setFilteredEditregions(filteredregions);

            const filteredregionheads = regionhead.filter(
                (regionheads) =>
                    regionheads.regionCode === editedPost.regionCode
            );
            setFilteredEditregionheads(filteredregionheads);

            const filteredBranches = branches.filter(
                (branch) => branch.regionCode === editedPost.regionCode
            );
            setFilteredEditbranches(filteredBranches);

            const filteredbranchCodes = branches.filter(
                (branch) =>
                    branch.regionCode === editedPost.regionCode &&
                    branch.branchName === editedPost.branchName &&
                    branch.branchCode !== editedPost.branchCode
            );
            setFilteredEditbranchCodes(filteredbranchCodes);
        } else {
            setFilteredEditregions([]);
            setFilteredEditregionheads([]);
            setFilteredEditbranches([]);
            setFilteredEditbranchCodes([]);
        }
    }, [editedPost, vertical, branches, verticalhead, businesshead, region, regionhead]);


    useEffect(() => {
        if (
            editedPost &&
            editedPost.regionCode &&
            region.length > 0 &&
            editedPost.regionHeadCode &&
            regionhead.length > 0 &&
            editedPost.branchCode &&
            branches.length > 0
        ) {
            const filteredRegions = region.filter(
                (regions) => regions.regionCode === editedPost.regionCode
            );
            setFilteredEditregions(filteredRegions);

            const filteredRegionHeads = regionhead.filter(
                (regionheads) =>
                    regionheads.regionCode === editedPost.regionCode &&
                    regionheads.regionHeadName === editedPost.regionHeadName &&
                    regionheads.regionHeadCode === editedPost.regionHeadCode
            );
            setFilteredEditregionheads(filteredRegionHeads);

            const filteredbranchCodes = branches.filter(
                (branch) =>
                    branch.regionCode === editedPost.regionCode &&
                    branch.branchCode === editedPost.branchCode
            );
            setFilteredEditbranchCodes(filteredbranchCodes);
        }
        if (
            editedPost &&
            editedPost.verticalCode &&
            vertical.length > 0 &&
            editedPost.verticalHeadName &&
            verticalhead.length > 0 &&
            editedPost.businessHeadCode &&
            businesshead.length > 0
        ) {
            const filteredVerticals = vertical.filter(
                (verticals) => verticals.verticalCode === editedPost.verticalCode
            );
            setFilteredEditverticals(filteredVerticals);

            const filteredVerticalHeads = verticalhead.filter(
                (verticalheads) =>
                    verticalheads.verticalCode === editedPost.verticalCode &&
                    verticalheads.verticalHeadName === editedPost.verticalHeadName
            );
            setFilteredEditverticalheads(filteredVerticalHeads);

            const filteredBusinessHeads = businesshead.filter(
                (businessheads) =>
                    businessheads.verticalCode === editedPost.verticalCode &&
                    businessheads.businessHeadCode === editedPost.businessHeadCode
            );
            setFilteredEditbusinessheads(filteredBusinessHeads);
        }
    }, [editedPost, region, branches, vertical, verticalhead, businesshead, regionhead]);

    const saveEditedPost = () => {
        console.log("Edited Post:", editedPost);

        //vertical
        const selectedVertical = vertical.find(
            (verticals) => verticals.verticalCode === editedPost.verticalCode
        );
        console.log("Selected Vertical:", selectedVertical);

        const selectedVerticalHead = verticalhead.find(
            (verticalheads) => verticalheads.verticalCode === editedPost.verticalCode
        );
        console.log("Selected Vertical Head:", selectedVerticalHead);

        const selectedBusinessHead = businesshead.find(
            (businessheads) => businessheads.verticalCode === editedPost.verticalCode
        );
        console.log("Selected Business Head:", selectedBusinessHead);

        //region
        const selectedRegion = region.find(
            (regions) => regions.regionCode === editedPost.regionCode
        );
        console.log("Selected Region:", selectedRegion);

        const selectedRegionHead = regionhead.find(
            (regionheads) => regionheads.regionCode === editedPost.regionCode
        );
        console.log("Selected Region Head:", selectedRegionHead);

        const selectedBranch = branches.find(
            (branch) =>
                branch.regionCode === editedPost.regionCode &&
                branch.branchName === editedPost.branchName
        );
        console.log("Selected Branch:", selectedBranch);

        const selectedBranch2 = branches.find(
            (branch) =>
                branch.regionCode === editedPost.regionCode &&
                branch.branchName === editedPost.Branchname2
        );
        console.log("Selected Branch2:", selectedBranch2);

        const selectedBranch3 = branches.find(
            (branch) =>
                branch.regionCode === editedPost.regionCode &&
                branch.branchName === editedPost.Branchname3
        );
        console.log("Selected Branch3:", selectedBranch3);

        const selectedBranch4 = branches.find(
            (branch) =>
                branch.regionCode === editedPost.regionCode &&
                branch.branchName === editedPost.Branchname4
        );
        console.log("Selected Branch4:", selectedBranch4);

        const selectedBranch5 = branches.find(
            (branch) =>
                branch.regionCode === editedPost.regionCode &&
                branch.branchName === editedPost.Branchname5
        );
        console.log("Selected Branch5:", selectedBranch5);
        if (
            selectedVertical &&
            selectedVerticalHead &&
            selectedBusinessHead &&
            selectedRegion &&
            selectedRegionHead &&
            selectedBranch &&
            (selectedBranch2 !== null || editedPost.Branchname2 === "") &&
            (selectedBranch3 !== null || editedPost.Branchname3 === "") &&
            (selectedBranch4 !== null || editedPost.Branchname4 === "") &&
            (selectedBranch5 !== null || editedPost.Branchname5 === "")
        ) {
            const updatedPost = {
                ...editedPost,
                verticalName: selectedVertical.verticalName,
                verticalHeadName: selectedVerticalHead.verticalHeadName,
                verticalHeadCode: selectedVerticalHead.verticalHeadCode,
                businessHeadName: selectedBusinessHead.businessHeadName,
                businessHeadCode: selectedBusinessHead.businessHeadCode,
                regionName: selectedRegion.regionName,
                regionHeadName: selectedRegionHead.regionHeadName,
                regionHeadCode: selectedRegionHead.regionHeadCode,
                branchCode: selectedBranch.branchCode,
                Branchcode2: selectedBranch2 ? selectedBranch2.branchCode : "",
                Branchcode3: selectedBranch3 ? selectedBranch3.branchCode : "",
                Branchcode4: selectedBranch4 ? selectedBranch4.branchCode : "",
                Branchcode5: selectedBranch5 ? selectedBranch5.branchCode : "",
            };

            axios
                .post(
                    `http://localhost:8800/api/auth/approval/${editedPost.id}`,
                    updatedPost
                )
                .then((res) => {
                    setPosts(
                        posts.map((post) =>
                            post.id === editedPost.id ? updatedPost : post
                        )
                    );
                    setEditedPost(null);
                    setEditDialogVisible(false);
                    alert("You have approved this user.");
                })
                .catch((error) => console.log(error));
        } else {
            // Handle the case when a selected value is not found
            console.log("One or more selected values not found.");
            alert("One or more selected values not found.");
        }
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
                <Column field="employeeCode" sortable header="Employee Code"></Column>
                <Column field="employeeName" sortable header="Employee Name"></Column>
                <Column field="mobileNumber" sortable header="Mobile Number"></Column>
                <Column
                    body={(rowData) => (

                        <Button
                            style={{ margin: '15px' }}
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
                maximizable
                style={{ width: "50vw" }}
                modal
                onHide={() => setEditDialogVisible(false)}
                className="my-dialog"
            >

                {editedPost && (
                    <div>
                        <div className="p-fluid">
                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="employeeName">Employee Name</label>
                                <InputText
                                    id="employeeName"
                                    required
                                    value={editedPost.employeeName}
                                    onChange={(e) =>
                                        setEditedPost({ ...editedPost, employeeName: e.target.value })
                                    }
                                />
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="employeeCode">Employee Code</label>
                                <InputText
                                    id="employeeCode"
                                    required
                                    value={editedPost.employeeCode}
                                    onChange={(e) =>
                                        setEditedPost({ ...editedPost, employeeCode: e.target.value })
                                    }
                                />
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="employeeDesignation">Employee Designation</label>
                                <InputText
                                    id="employeeDesignation"
                                    required
                                    value={editedPost.employeeDesignation}
                                    onChange={(e) =>
                                        setEditedPost({ ...editedPost, employeeDesignation: e.target.value })
                                    }
                                />
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="emailId">Email Id</label>
                                <InputText
                                    id="emailId"
                                    required
                                    value={editedPost.emailId}
                                    onChange={(e) =>
                                        setEditedPost({ ...editedPost, emailId: e.target.value })
                                    }
                                />
                            </div>


                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="role">Roles</label>
                                <select
                                    required
                                    id="role"
                                    name="role"
                                    value={editedPost.role}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            role: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    <option value="">Select Role</option>
                                    <option value="Employee">Employee</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="status">Status</label>
                                <select
                                    required
                                    id="status"
                                    name="status"
                                    value={editedPost.status}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            status: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="mobileNumber">Mobile Number</label>
                                <InputText
                                    id="mobileNumber"
                                    required
                                    value={editedPost.mobileNumber}
                                    onChange={(e) =>
                                        setEditedPost({ ...editedPost, mobileNumber: e.target.value })
                                    }
                                />
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="regionCode">Region Code</label>
                                <select
                                    id="regionCode"
                                    required
                                    value={editedPost.regionCode}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            regionCode: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    <option value="">Select Region Code</option>
                                    {region.map((regions) => (
                                        <option key={regions.regionCode} value={regions.regionCode}>
                                            {regions.regionCode}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="regionName">Region Name</label>
                                <select
                                    id="regionName"
                                    value={editedPost.regionName}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            regionName: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                    style={{ pointerEvents: "none", appearance: "none" }}
                                >
                                    {filteredEditregions.map((regions) => (
                                        <option key={regions.regionName} value={regions.regionName}>
                                            {regions.regionName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="regionHeadName">Region Head Name</label>
                                <select
                                    id="regionHeadName"
                                    value={editedPost.regionHeadName}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            regionHeadName: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                    style={{ pointerEvents: "none", appearance: "none" }}
                                >
                                    {filteredEditregionheads.map((regionhead) => (
                                        <option
                                            key={regionhead.regionHeadName}
                                            value={regionhead.regionHeadName}
                                        >
                                            {regionhead.regionHeadName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div hidden className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="regionHeadCode">Region Head Code</label>
                                <select
                                    id="regionHeadCode"
                                    value={editedPost.regionHeadCode}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            regionHeadCode: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    {filteredEditregionheads.map((regionhead) => (
                                        <option
                                            key={regionhead.regionHeadCode}
                                            value={regionhead.regionHeadCode}
                                        >
                                            {regionhead.regionHeadCode}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="branchName">Branch Name</label>
                                <select
                                    id="branchName"
                                    required
                                    value={editedPost.branchName}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            branchName: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    <option value="">Select Branch Name</option>
                                    {filteredEditbranches.map((branch) => (
                                        <option key={branch.branchName} value={branch.branchName}>
                                            {branch.branchName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div hidden className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="branchCode">Branch Code</label>
                                <select
                                    id="branchCode"
                                    value={editedPost.branchCode}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            branchCode: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    {filteredEditbranchCodes.map((branch) => (
                                        <option key={branch.branchCode} value={branch.branchCode}>
                                            {branch.branchCode}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="verticalCode">Vertical Code</label>
                                <select
                                    id="verticalCode"
                                    required
                                    value={editedPost.verticalCode}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            verticalCode: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    <option value="">Select Vertical Code</option>
                                    {vertical.map((verticals) => (
                                        <option key={verticals.verticalCode} value={verticals.verticalCode}>
                                            {verticals.verticalCode}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="verticalName">Vertical Name</label>
                                <select
                                    id="verticalName"
                                    value={editedPost.verticalName}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            verticalName: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                    style={{ pointerEvents: "none", appearance: "none" }}
                                >
                                    {filteredEditverticals.map((verticals) => (
                                        <option key={verticals.verticalName} value={verticals.verticalName}>
                                            {verticals.verticalName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="verticalHeadName">Vertical Head Name</label>
                                <select
                                    id="verticalHeadName"
                                    value={editedPost.verticalHeadName}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            verticalHeadName: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                    style={{ pointerEvents: "none", appearance: "none" }}
                                >
                                    {filteredEditverticalheads.map((verticalheads) => (
                                        <option key={verticalheads.verticalHeadName} value={verticalheads.verticalHeadName}>
                                            {verticalheads.verticalHeadName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div hidden className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="verticalHeadCode">Vertical Head Code</label>
                                <select
                                    id="verticalHeadCode"
                                    value={editedPost.verticalHeadCode}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            verticalHeadCode: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    {filteredEditverticalheads.map((verticalheads) => (
                                        <option key={verticalheads.verticalHeadCode} value={verticalheads.verticalHeadCode}>
                                            {verticalheads.verticalHeadCode}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="businessHeadName">Business Head Name</label>
                                <select
                                    id="businessHeadName"
                                    value={editedPost.businessHeadName}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            businessHeadName: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                    style={{ pointerEvents: "none", appearance: "none" }}
                                >
                                    {filteredEditbusinessheads.map((businessheads) => (
                                        <option key={businessheads.businessHeadName} value={businessheads.businessHeadName}>
                                            {businessheads.businessHeadName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div hidden className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="businessHeadCode">Business Head Code</label>
                                <select
                                    id="businessHeadCode"
                                    value={editedPost.businessHeadCode}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            businessHeadCode: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    {filteredEditbusinessheads.map((businessheads) => (
                                        <option key={businessheads.businessHeadCode} value={businessheads.businessHeadCode}>
                                            {businessheads.businessHeadCode}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="Branchname2">Branch Name 2</label>
                                <select
                                    id="Branchname2"
                                    value={editedPost.Branchname2}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            Branchname2: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    <option value="">Select Branch Name 2</option>
                                    {filteredEditbranches.map((branch) => (
                                        <option key={branch.branchName} value={branch.branchName}>
                                            {branch.branchName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div hidden className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="Branchcode2">Branch Code 2</label>
                                <select
                                    id="Branchcode2"
                                    value={editedPost.Branchcode2}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            Branchcode2: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    {filteredEditbranchCodes.map((branch) => (
                                        <option key={branch.branchCode} value={branch.branchCode}>
                                            {branch.branchCode}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="Branchname3">Branch Name 3</label>
                                <select
                                    id="Branchname3"
                                    value={editedPost.Branchname3}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            Branchname3: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    <option value="">Select Branch Name 3</option>
                                    {filteredEditbranches.map((branch) => (
                                        <option key={branch.branchName} value={branch.branchName}>
                                            {branch.branchName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div hidden className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="Branchcode3">Branch Code 3</label>
                                <select
                                    id="Branchcode3"
                                    value={editedPost.Branchcode3}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            Branchcode3: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    {filteredEditbranchCodes.map((branch) => (
                                        <option key={branch.branchCode} value={branch.branchCode}>
                                            {branch.branchCode}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="Branchname4">Branch Name 4</label>
                                <select
                                    id="Branchname4"
                                    value={editedPost.Branchname4}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            Branchname4: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    <option value="">Select Branch Name 4</option>
                                    {filteredEditbranches.map((branch) => (
                                        <option key={branch.branchName} value={branch.branchName}>
                                            {branch.branchName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div hidden className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="Branchcode4">Branch Code 4</label>
                                <select
                                    id="Branchcode4"
                                    value={editedPost.Branchcode4}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            Branchcode4: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    {filteredEditbranchCodes.map((branch) => (
                                        <option key={branch.branchCode} value={branch.branchCode}>
                                            {branch.branchCode}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="Branchname5">Branch Name 5</label>
                                <select
                                    id="Branchname5"
                                    value={editedPost.Branchname5}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            Branchname5: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    <option value="">Select Branch Name 5</option>
                                    {filteredEditbranches.map((branch) => (
                                        <option key={branch.branchName} value={branch.branchName}>
                                            {branch.branchName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div hidden className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="Branchcode5">Branch Code 5</label>
                                <select
                                    id="Branchcode5"
                                    value={editedPost.Branchcode5}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            Branchcode5: e.target.value,
                                        })
                                    }
                                    disabled={!editedPost}
                                    className="userinput"
                                >
                                    {filteredEditbranchCodes.map((branch) => (
                                        <option key={branch.branchCode} value={branch.branchCode}>
                                            {branch.branchCode}
                                        </option>
                                    ))}
                                </select>
                            </div>


                        </div>
                        <a href="/admin/approvalmaster">
                        <Button label="Approve" icon="pi pi-check" onClick={saveEditedPost} />
                        </a>
                    </div>
                )}
            </Dialog>

        </div>


    );
};

export default Approval;