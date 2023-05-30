import React, { useState, useContext, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { AuthContext } from "../../../context/authContext";
import exc from "../../../Assets/exc.svg";
import axios from "axios";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import "./leadAdmin.css";
import { data } from "../../../constants/admindata";
import UserInfo from "../../../Components/Admin/user-info/UserInfo";
import { Link } from "react-router-dom";

const LeadAdmin = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [showDataTable, setShowDataTable] = useState(false);
  const [filters, setFilters] = useState({});
  const [editedPost, setEditedPost] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const [inputs, setInputs] = useState({
          leadRefID: `PL${currentUser.employeeCode}${new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase()}${new Date().toISOString().replace(/[-:.Z]/g, '').replace('T', '')}`,
          employeeCode: "",
          employeeName: "",
          branchCode: "",
          branchName: "",
          customerCode: "",
          customerName: "",
          customerPAN: "",
          customerAddress: "",
          customerCity: "",
          customerPinCode: "",
          customerMobileNumber: "",
          verticalName: "",
          productName: "",
          principalName: "",
          purchaseType: "",
          businessAmount: "",
          creditBranch: "",
          status: "",
          refNumber: "",
  });

  const [employees, setemployee] = useState([]);
  const [region, setregion] = useState([]);
  const [regionhead, setregionhead] = useState([]);
  const [branches, setBranches] = useState([]);
  const [vertical, setvertical] = useState([]);
  const [verticalhead, setverticalhead] = useState([]);
  const [businesshead, setbusinesshead] = useState([]);

  const [filteredemployee, setFilteredEmployee] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [filteredbranchCodes, setFilteredbranchCodes] = useState([]);
  const [filteredverticals, setFilteredverticals] = useState([]);
  const [filteredregions, setFilteredregions] = useState([]);
  const [filteredregionheads, setFilteredregionheads] = useState([]);
  const [filteredbusinessheads, setFilteredbusinessheads] = useState([]);
  const [filteredverticalheads, setFilteredverticalheads] = useState([]);

  const [showAdditionaluser, setShowAdditionaluser] = useState(false);

  const [filteredEditverticals, setFilteredEditverticals] = useState([]);
  const [filteredEditverticalheads, setFilteredEditverticalheads] = useState([]);
  const [filteredEditbusinessheads, setFilteredEditbusinessheads] = useState([]);
  const [filteredEditregions, setFilteredEditregions] = useState([]);
  const [filteredEditbranches, setFilteredEditbranches] = useState([]);
  const [filteredEditbranchCodes, setFilteredEditbranchCodes] = useState([]);
  const [filteredEditregionheads, setFilteredEditregionheads] = useState([]);

  // fetch


  useEffect(() => {
    const fetchleaduser = async () => {
        const res = await axios.get(
          "http://localhost:8800/api/auth/leaduserdata"
        );
        setemployee(res.data);
      };

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
    fetchleaduser();
    fetchregion();
    fetchbranch();
    fetchregionhead();
    fetchvertical();
    fetchverticalhead();
    fetchbusiness();
  }, []);

  //filters
  useEffect(() => {
    if (inputs.employeeCode) {
        const filteredemployee = employees.filter(
          (employee) => employee.employeeCode === inputs.employeeCode
        );
        setFilteredEmployee(filteredemployee);
      } else {
        setFilteredEmployee([]);
      }

    if (inputs.verticalCode) {
      const filteredverticals = vertical.filter(
        (verticals) => verticals.verticalCode === inputs.verticalCode
      );
      setFilteredverticals(filteredverticals);

      const filteredverticalheads = verticalhead.filter(
        (verticalheads) => verticalheads.verticalCode === inputs.verticalCode
      );
      setFilteredverticalheads(filteredverticalheads);

      const filteredbusinessheads = businesshead.filter(
        (businessheads) => businessheads.verticalCode === inputs.verticalCode
      );
      setFilteredbusinessheads(filteredbusinessheads);
    } else {
      setFilteredverticals([]);
      setFilteredverticalheads([]);
      setFilteredbusinessheads([]);
    }

    if (inputs.branchName) {
        const filteredBranches = branches.filter(
          (branch) => branch.branchName === inputs.branchName
        );
        setFilteredBranches(filteredBranches);
      } else {
        setFilteredBranches([]);
      }

  }, [
    inputs.employeeCode,
    employees,
    inputs.verticalCode,
    vertical,
    businesshead,
    inputs.branchName,
    branches,
  ]);

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
  


  //input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    if (name === "branchName") {
      const selectedBranch = branches.find(
        (branch) =>
          branch.regionCode === inputs.regionCode && branch.branchName === value
      );
      console.log("selectedBranch:", selectedBranch);
      setInputs((prevInputs) => ({
        ...prevInputs,
        branchCode: selectedBranch ? selectedBranch.branchCode : "",
      }));
    }

    if (name === "verticalCode") {
      const selectedVerticalhead = verticalhead.find(
        (verticalheads) => verticalheads.verticalCode === value
      );
      const selectedVertical = businesshead.find(
        (businessheads) => businessheads.verticalCode === value
      );

      setInputs((prevInputs) => ({
        ...prevInputs,
        verticalName: selectedVertical ? selectedVertical.verticalName : "",
        verticalHeadName: selectedVerticalhead
          ? selectedVerticalhead.verticalHeadName
          : "",
        verticalHeadCode: selectedVerticalhead
          ? selectedVerticalhead.verticalHeadCode
          : "",
        businessHeadName: selectedVertical
          ? selectedVertical.businessHeadName
          : "",
        businessHeadCode: selectedVertical
          ? selectedVertical.businessHeadCode
          : "",
      }));
    }

    if (name === "regionCode") {
      const selectedRegion = region.find(
        (regions) => regions.regionCode === value
      );
      console.log("selectedRegion:", selectedRegion);
      setInputs((prevInputs) => ({
        ...prevInputs,
        regionName: selectedRegion ? selectedRegion.regionName : "",
        regionHeadName: "",
      }));

      const filteredregionheads = regionhead.filter(
        (regionheads) => regionheads.regionCode === value
      );
      setFilteredregionheads(filteredregionheads);

      if (filteredregionheads.length === 1) {
        const selectedRegionHead = filteredregionheads[0];
        console.log("selectedRegionHead:", selectedRegionHead);
        setInputs((prevInputs) => ({
          ...prevInputs,
          regionHeadName: selectedRegionHead.regionHeadName,
          regionHeadCode: selectedRegionHead.regionHeadCode,
        }));
      }
    }
  };

  //form submit (insert)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/adminlead",
        { ...inputs }
      );
      setMsg(response.data); // Extract the 'msg' property from the response object
      setErr(null);
    } catch (err) {
      setErr(err.response.data); // Extract the 'err' property from the error object
      setMsg(null);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8800/api/auth/adminleaddata").then((res) => {
      setPosts(res.data);
    });
  }, []);

  const saveEditedPost = () => {
    console.log("Edited Post:", editedPost);

  //vertical
    const selectedVertical = vertical.find(
      (verticals) => verticals.verticalCode === editedPost.verticalCode
    );
    console.log("Selected Vertical:", selectedVertical);
  
    const selectedVerticalHead = verticalhead.find(
      (verticalheads) =>
        verticalheads.verticalCode === editedPost.verticalCode 
    );
    console.log("Selected Vertical Head:", selectedVerticalHead);
  
    const selectedBusinessHead = businesshead.find(
      (businessheads) =>
        businessheads.verticalCode === editedPost.verticalCode 
    );
    console.log("Selected Business Head:", selectedBusinessHead);
  
    //region
    const selectedRegion = region.find(
      (regions) => regions.regionCode === editedPost.regionCode
    );
    console.log("Selected Region:", selectedRegion);
  
    const selectedRegionHead = regionhead.find(
      (regionheads) =>
        regionheads.regionCode === editedPost.regionCode 
    );
    console.log("Selected Region Head:", selectedRegionHead);
  
    const selectedBranch = branches.find(
      (branch) =>
        branch.regionCode === editedPost.regionCode &&
        branch.branchName === editedPost.branchName
    );
    console.log("Selected Branch:", selectedBranch);
  
    if (
      selectedVertical &&
      selectedVerticalHead &&
      selectedBusinessHead &&
      selectedRegion &&
      selectedRegionHead &&
      selectedBranch
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
      };
  
      axios
        .put(
          `http://localhost:8800/api/auth/edituser/${editedPost.id}`,
          updatedPost
        )
        .then((res) => {
          setPosts(
            posts.map((post) => (post.id === editedPost.id ? updatedPost : post))
          );
          setEditedPost(null);
          setEditDialogVisible(false);
          alert("You have edited the data.");
        })
        .catch((error) => console.log(error));
    } else {
      // Handle the case when a selected value is not found
      console.log("One or more selected values not found.");
      alert("One or more selected values not found.");
    }
  };
  
  
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
        setFilteredregions(filteredRegions);
    
        const filteredRegionHeads = regionhead.filter(
          (regionheads) =>
          regionheads.regionCode === editedPost.regionCode &&
          regionheads.regionHeadName === editedPost.regionHeadName &&
          regionheads.regionHeadCode === editedPost.regionHeadCode
        );
        setFilteredregionheads(filteredRegionHeads);

        const filteredbranchCodes = branches.filter(
          (branch) =>
          branch.regionCode === editedPost.regionCode &&
          branch.branchCode === editedPost.branchCode
        );
        setFilteredbranchCodes(filteredbranchCodes);
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
      setFilteredverticals(filteredVerticals);

      const filteredVerticalHeads = verticalhead.filter(
        (verticalheads) =>
        verticalheads.verticalCode === editedPost.verticalCode &&
        verticalheads.verticalHeadName === editedPost.verticalHeadName
      );
      setFilteredverticalheads(filteredVerticalHeads);
  
      const filteredBusinessHeads = businesshead.filter(
        (businessheads) =>
          businessheads.verticalCode === editedPost.verticalCode &&
          businessheads.businessHeadCode === editedPost.businessHeadCode
      );
      setFilteredbusinessheads(filteredBusinessHeads);
    }
  }, [editedPost, region, branches, vertical, verticalhead, businesshead, regionhead]);


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

    setShowDataTable(value.length > 0); // Show DataTable if there is a search query
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      employeeName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      employeeCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      employeeDesignation: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      mobileNumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      emailId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regionCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regionName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      verticalCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      verticalName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      verticalHeadCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      verticalHeadName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regionHeadCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      regionHeadName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      businessHeadCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      businessHeadName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode2: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName2: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode3: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName3: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode4: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName4: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchCode5: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      branchName5: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    setGlobalFilterValue("");
  };

  const downloadCSV = () => {
    // Define the headers for the CSV
    const headers = [
      "Employee Name",
      "Employee Code",
      "Employee Designation",
      "Mobile Number",
      "Email Id",
      "Region Code",
      "Region Name",
      "Branch Code",
      "Branch Name",
      "Vertical Code",
      "Vertical Name",
      "Vertical Head Code",
      "Vertical Head Name",
      "Region Head Code",
      "Region Head Name",
      "Business Head Code",
      "Business Head Name",
      "Branch Code 2",
      "Branch Name 2",
      "Branch Code 3",
      "Branch Name 3",
      "Branch Code 4",
      "Branch Name 4",
      "Branch Code 5",
      "Branch Name 5",
    ];

    // Create an array of rows to be included in the CSV
    const rows = posts.map((post) => [
      post.employeeName,
      post.employeeCode,
      post.employeeDesignation,
      post.mobileNumber,
      post.emailId,
      post.regionCode,
      post.regionName,
      post.branchCode,
      post.branchName,
      post.verticalCode,
      post.verticalName,
      post.verticalHeadCode,
      post.verticalHeadName,
      post.regionHeadCode,
      post.regionHeadName,
      post.businessHeadCode,
      post.businessHeadName,
      post.branchCode2,
      post.branchName2,
      post.branchCode3,
      post.branchName3,
      post.branchCode4,
      post.branchName4,
      post.branchCode5,
      post.branchName5,
    ]);

    // Combine headers and rows into a single array
    const csvData = [headers, ...rows];

    // Convert the array to CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((row) => row.join(",")).join("\n");

    // Create a download link and trigger the download
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "employeemaster.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sampleInvestments = [
    {
      employeeName: "",
      employeeCode: "",
      branchCode: "",  
      customerCode: "",
      customerName: "",
      customerPAN: "",
      customerAddress: "",
      customerCity: "",
      customerPinCode: "",
      customerMobileNumber: "",
      verticalName: "",
      productName: "",
      principalName: "",
      purchaseType: "",
      businessAmount: "",
      creditBranch: "",
      status: "",
      refNumber: "",
    },
  ];

  const samplecsvHomeLoans  = [
    {
      employeeName: "",
      employeeCode: "",

    },
  ];


  const samplecsvInsurance = [
    {
      employeeName: "",
      employeeCode: "",

    },
  ];

  const samplecsvfields = [
    {
      employeeName: "",
      employeeCode: "",

    },
  ];


  const handleFileUpload = (file) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const { data } = results;
        const filteredData = data.filter((row) => {
          return Object.values(row).some((value) => value.trim() !== "");
        });
        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < filteredData.length; i++) {
          const row = filteredData[i];
  
          try {
            let selectedEmployee = null;
            let selectedBranch = null;
  
            if (row.employeeCode) {
              selectedEmployee = employees.find(
                (employee) => employee.employeeCode === row.employeeCode
              );
            }
  
            if (row.branchCode) {
              selectedBranch = branches.find(
                (branch) => branch.branchCode === row.branchCode
              );
            }
  
            const leadRefID = `PL${currentUser.employeeCode}${new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase()}${new Date().toISOString().replace(/[-:.Z]/g, '').replace('T', '')}`;
  
            await axios.post("http://localhost:8800/api/auth/adminlead", {
              leadRefID,
              employeeCode: row.employeeCode,
              employeeName: selectedEmployee ? selectedEmployee.employeeName : "",
              branchCode: row.branchCode,
              branchName: selectedBranch ? selectedBranch.branchName : "",
              customerName: row.customerName,
              customerAddress: row.customerAddress,
              customerCity: row.customerCity,
              customerCity: row.customerCity,
              customerPinCode: row.customerPinCode,
              customerMobileNumber: row.customerMobileNumber,
              verticalName: row.verticalName,
              productName: row.productName,
              principalName: row.principalName,
            });
            successCount++;
          } catch (error) {
            console.error(`Error processing row ${i + 2}:`, error);
            errorCount++;
          }
        }
        if (successCount === filteredData.length) {
          alert("Data successfully uploaded");
        } else if (errorCount === filteredData.length) {
          alert("Failed to upload. Retry again.");
        } else {
          alert(
            `Data uploaded successfully (${successCount} row(s)), with ${errorCount} error(s).`
          );
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Reload after 2 seconds
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
          marginLeft:""
        }}
      >
        Leads
      </p>

      <div hidden>
        <p
          type="button"
          className="Addbuttonuser"
          onClick={() => setShowAdditionaluser(true)}
        >
          <i className="fa fa-plus"></i>Click Here to Create Lead{" "}
        </p>

        <div className={`additional-user ${showAdditionaluser ? "show" : ""}`}>
          <div className="form-container-user">
            <form className="formuser" onSubmit={handleSubmit} hidden>

            <div hidden>
                <label>
                  <input
                    required
                    autoComplete="off"
                    type="hidden"
                    className="userinput"
                    id="leadRefID"
                    name="leadRefID"
                    value={`PL${currentUser.employeeCode}${new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase()}${new Date().toISOString().replace(/[-:.Z]/g, '').replace('T', '')}`}
                  />
                </label>
              </div>

              <div>
                <label>
                  Employee code
                  <select
                    required
                    className="userinput"
                    id="employeeCode"
                    name="employeeCode"
                    value={inputs.employeeCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Employee Code</option>
                    {employees.map((employee) => (
                      <option
                        key={employee.employeeCode}
                        value={employee.employeeCode}
                      >
                        {employee.employeeCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Employee Name
                  <select
                    className="userinput"
                    id="employeeName"
                    name="employeeName"
                    value={inputs.employeeName || ""}
                    onChange={handleChange}
                    style={{ pointerEvents: "none", appearance: "none" }}
                  >
                    {filteredemployee.map((employee) => (
                      <option
                        key={employee.employeeName}
                        value={employee.employeeName}
                      >
                        {employee.employeeName}
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
                    id="branchName"
                    name="branchName"
                    value={inputs.branchName || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Branch Name</option>
                    {branches.map((branch) => (
                      <option key={branch.branchName} value={branch.branchName}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div >
                <label>
                  Branch Code
                  <select
                    className="userinput"
                    id="branchCode"
                    name="branchCode"
                    value={inputs.branchCode || ""}
                    onChange={handleChange}
                    style={{ pointerEvents: "none", appearance: "none" }}
                  >
                    {filteredBranches.map((branch) => (
                      <option key={branch.branchCode} value={branch.branchCode}>
                        {branch.branchCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Customer Code
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="customerCode"
                    name="customerCode"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div>
                <label>
                Customer Name
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="CustomerName"
                    name="CustomerName"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div>
                <label>
                  Customer Address
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="CustomerAddress"
                    name="CustomerAddress"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div>
                <label>
                  Customer City
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="CustomerCity"
                    name="CustomerCity"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div>
                <label>
                  Pin Code
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="CustomerPinCode"
                    name="CustomerPinCode"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div>
                <label>
                  Customer Mobile Number
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="CustomerMobileNumber"
                    name="CustomerMobileNumber"
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
                    id="regionCode"
                    name="regionCode"
                    value={inputs.regionCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Region Code</option>
                    {region.map((regions) => (
                      <option
                        key={regions.regionCode}
                        value={regions.regionCode}
                      >
                        {regions.regionCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Region Name
                  <select
                    className="userinput"
                    id="regionName"
                    name="regionName"
                    value={inputs.regionName || ""}
                    onChange={handleChange}
                    style={{ pointerEvents: "none", appearance: "none" }}
                  >
                    {filteredregions.map((regions) => (
                      <option
                        key={regions.regionName}
                        value={regions.regionName}
                      >
                        {regions.regionName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Region Head Name
                  <select
                    className="userinput"
                    id="regionHeadName"
                    name="regionHeadName"
                    value={inputs.regionHeadName || ""}
                    onChange={handleChange}
                    style={{ pointerEvents: "none", appearance: "none" }}
                  >
                    {filteredregionheads.map((regionhead) => (
                      <option
                        key={regionhead.regionHeadName}
                        value={regionhead.regionHeadName}
                      >
                        {regionhead.regionHeadName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div hidden>
                <label>
                  Region Head Code
                  <select
                    className="userinput"
                    id="regionHeadCode"
                    name="regionHeadCode"
                    value={inputs.regionHeadCode || ""}
                    onChange={handleChange}
                  >
                    {filteredregionheads.map((regionhead) => (
                      <option
                        key={regionhead.regionHeadCode}
                        value={regionhead.regionHeadCode}
                      >
                        {regionhead.regionHeadCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              

              <div>
                <label>
                  Vertical Code
                  <select
                    required
                    className="userinput"
                    id="verticalCode"
                    name="verticalCode"
                    value={inputs.verticalCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Vertical Code</option>
                    {vertical.map((verticals) => (
                      <option
                        key={verticals.verticalCode}
                        value={verticals.verticalCode}
                      >
                        {verticals.verticalCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Vertical Name
                  <select
                    className="userinput"
                    id="verticalName"
                    name="verticalName"
                    value={inputs.verticalName || ""}
                    onChange={handleChange}
                    style={{ pointerEvents: "none", appearance: "none" }}
                  >
                    {filteredverticals.map((verticals) => (
                      <option
                        key={verticals.verticalName}
                        value={verticals.verticalName}
                      >
                        {verticals.verticalName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Vertical Head Name
                  <select
                    className="userinput"
                    id="verticalHeadName"
                    name="verticalHeadName"
                    value={inputs.verticalHeadName || ""}
                    onChange={handleChange}
                    style={{ pointerEvents: "none", appearance: "none" }}
                  >
                    {filteredverticalheads.map((verticalheads) => (
                      <option
                        key={verticalheads.verticalHeadName}
                        value={verticalheads.verticalHeadName}
                      >
                        {verticalheads.verticalHeadName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div hidden>
                <label>
                  Vertical Head Code
                  <select
                    required
                    className="userinput"
                    id="verticalHeadCode"
                    name="verticalHeadCode"
                    value={inputs.verticalHeadCode || ""}
                    onChange={handleChange}
                  >
                    {filteredverticalheads.map((verticalheads) => (
                      <option
                        key={verticalheads.verticalHeadCode}
                        value={verticalheads.verticalHeadCode}
                      >
                        {verticalheads.verticalHeadCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Business Head Name
                  <select
                    className="userinput"
                    id="businessHeadName"
                    name="businessHeadName"
                    value={inputs.businessHeadName || ""}
                    onChange={handleChange}
                    style={{ pointerEvents: "none", appearance: "none" }}
                  >
                    {filteredbusinessheads.map((businesshead) => (
                      <option
                        key={businesshead.businessHeadName}
                        value={businesshead.businessHeadName}
                      >
                        {businesshead.businessHeadName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div hidden>
                <label>
                  Business Head Code
                  <select
                    required
                    className="userinput"
                    id="businessHeadCode"
                    name="businessHeadCode"
                    value={inputs.businessHeadCode || ""}
                    onChange={handleChange}
                  >
                    {filteredbusinessheads.map((businesshead) => (
                      <option
                        key={businesshead.businessHeadCode}
                        value={businesshead.businessHeadCode}
                      >
                        {businesshead.businessHeadCode}
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

          {err && (
            <>
              <div className="popup-background"></div>
              <div className="popup-wrapper">
                <p className="investmsgp">{err.sqlMessage}</p>
                <div className="investmsg-buttons">
                  <a href="/admin/employeemaster">
                    <button
                      className="investmsg-no"
                      onClick={() => setErr(null)}
                    >
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
                <a href="/admin/employeemaster">
                  <p className="investmsgclose" onClick={() => setMsg(null)}>
                    close
                  </p>
                </a>
              </div>
            </>
          )}

         
        </div>
        </div>

       
        <div
          className="flex align-items-start justify-content-start gap-2 exc"
          style={{
            marginBottom: "30px",
            marginTop: "20px",
            marginLeft:"-10px",
          }}
        >
          <Button
          style={{width:"7rem", padding:"10px"}}>
            <CSVLink
              data={sampleInvestments}
              filename={"sampleinvestmentsdata"}
              target="_blank"
            >
              Investments
            </CSVLink>
          </Button>

          <Button
          style={{width:"7rem",padding:"10px"}}>
            <CSVLink
              data={samplecsvHomeLoans}
              filename={"samplehomeloansdata"}
              target="_blank"
            >
              Home Loans
            </CSVLink>
          </Button>

          <Button
          style={{width:"6rem",padding:"10px"}}>
            <CSVLink
              data={samplecsvInsurance}
              filename={"sampleinsurancedata"}
              target="_blank"
            >
              Insurance
            </CSVLink>
          </Button>

          <Button
          style={{width:"5.5rem",padding:"10px"}}>
            <CSVLink
              data={samplecsvfields}
              filename={"sampleleadsdata"}
              target="_blank"
            >
              All fields
            </CSVLink>
          </Button>


          {/* <Button
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
          /> */}
          
        </div>
        <input
            type="file"
            className="branchfile"
            style={{marginTop:"-5rem", marginLeft:"38rem"}}
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
    
      <div className="flex align-items-end justify-content-start gap-2 clearred"
       style={{
        marginTop: "10px",
        marginLeft:"-30px"
      }}>
        
        
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
      {showDataTable && (
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
        <Column field="leadRefID" sortable header="Lead RefID"></Column>
        <Column field="employeeCode" sortable header="Employee Code"></Column>
        <Column field="employeeName" sortable header="Employee Name"></Column>
        <Column field="branchCode" sortable header="Branch Code"></Column>
        <Column field="branchName" sortable header="Branch Name"></Column>
        <Column field="customerCode" sortable header="Customer Code"></Column>
        <Column field="customerName" sortable header="Customer Name"></Column>
        <Column field="customerPAN" sortable header="Customer PAN"></Column>
        <Column field="customerAddress" sortable header="Customer Address"></Column>
        <Column field="customerCity" sortable header="Customer City"></Column>
        <Column field="customerPinCode" sortable header="Customer Pin Code"></Column>
        <Column field="customerMobileNumber" sortable header="Customer Mobile Number"></Column>
        <Column field="verticalName" sortable header="Vertical Name"></Column>
        <Column field="productName" sortable header="Product Name"></Column>
        <Column field="principalName" sortable header="Principal Name"></Column>
        <Column field="purchaseType" sortable header="Purchase Type"></Column>
        <Column field="businessAmount" sortable header="Business Amount"></Column>
        <Column field="creditBranch" sortable header="Credit Branch"></Column>
        <Column field="status" sortable header="Status"></Column>
        <Column field="refNumber" sortable header="Reference Number"></Column>
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
      </DataTable>
            )}
      <Dialog
        header="Update Lead Data"
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
                <label htmlFor="employeeCode">Employee Code</label>
                <InputText
                  id="employeeCode"
                  required
                  value={editedPost.employeeCode}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      employeeCode: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="employeeName">Employee Name</label>
                <InputText
                  id="employeeName"
                  required
                  value={editedPost.employeeName}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      employeeName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="mobileNumber">Mobile Number</label>
                <InputText
                  id="mobileNumber"
                  required
                  value={editedPost.mobileNumber}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      mobileNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="emailId">Email ID</label>
                <InputText
                  id="emailId"
                  required
                  value={editedPost.emailId}
                  onChange={(e) =>
                    setEditedPost({
                      ...editedPost,
                      emailId: e.target.value,
                    })
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
                    setEditedPost({
                      ...editedPost,
                      employeeDesignation: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-field" style={{ paddingBottom: "10px" }}>
                <label htmlFor="regionCode">Region Code</label>
                <select
                  id="regionCode"
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

              
            </div>
            <Button label="Save" icon="pi pi-check" onClick={saveEditedPost} />
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default LeadAdmin;
