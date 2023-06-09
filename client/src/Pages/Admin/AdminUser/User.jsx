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
    employeeName: "",
    employeeCode: "",
    employeeDesignation: "",
    mobileNumber: "",
    emailId: "",
    regionCode: "",
    regionName: "",
    branchCode: "",
    branchName: "",
    verticalCode: "",
    verticalName: "",
    verticalHeadCode: "",
    verticalHeadName: "",
    regionHeadCode: "",
    regionHeadName: "",
    businessHeadCode: "",
    businessHeadName: "",
    Branchcode2: "",
    Branchname2: "",
    Branchcode3: "",
    Branchname3: "",
    Branchcode4: "",
    Branchname4: "",
    Branchcode5: "",
    Branchname5: "",
    role: "",
  });

  const [region, setregion] = useState([]);
  const [regionhead, setregionhead] = useState([]);
  const [branches, setBranches] = useState([]);
  const [vertical, setvertical] = useState([]);
  const [verticalhead, setverticalhead] = useState([]);
  const [businesshead, setbusinesshead] = useState([]);

  const [filteredBranches, setFilteredBranches] = useState([]);
  const [filteredbranchCodes, setFilteredbranchCodes] = useState([]);
  const [filteredverticals, setFilteredverticals] = useState([]);
  const [filteredregions, setFilteredregions] = useState([]);
  const [filteredregionheads, setFilteredregionheads] = useState([]);
  const [filteredbusinessheads, setFilteredbusinessheads] = useState([]);
  const [filteredverticalheads, setFilteredverticalheads] = useState([]);

  const [showAdditionaluser, setShowAdditionaluser] = useState(false);

  const [filteredEditverticals, setFilteredEditverticals] = useState([]);
  const [filteredEditverticalheads, setFilteredEditverticalheads] = useState(
    []
  );
  const [filteredEditbusinessheads, setFilteredEditbusinessheads] = useState(
    []
  );
  const [filteredEditregions, setFilteredEditregions] = useState([]);
  const [filteredEditbranches, setFilteredEditbranches] = useState([]);
  const [filteredEditbranchCodes, setFilteredEditbranchCodes] = useState([]);
  const [filteredEditregionheads, setFilteredEditregionheads] = useState([]);

  // fetch
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

  //filters
  useEffect(() => {
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

    if (inputs.regionCode) {
      const filteredregions = region.filter(
        (regions) => regions.regionCode === inputs.regionCode
      );
      setFilteredregions(filteredregions);

      const filteredregionheads = regionhead.filter(
        (regionheads) => regionheads.regionCode === inputs.regionCode
      );
      setFilteredregionheads(filteredregionheads);

      const filteredBranches = branches.filter(
        (branch) => branch.regionCode === inputs.regionCode
      );
      setFilteredBranches(filteredBranches);

      const filteredbranchCodes = branches.filter(
        (branch) =>
          branch.regionCode === inputs.regionCode &&
          branch.branchName === inputs.branchName &&
          branch.branchCode !== inputs.branchCode
      );
      setFilteredbranchCodes(filteredbranchCodes);
    } else {
      setFilteredregions([]);
      setFilteredregionheads([]);
      setFilteredBranches([]);
      setFilteredbranchCodes([]);
    }
  }, [
    inputs.verticalCode,
    vertical,
    businesshead,
    inputs.regionCode,
    inputs.branchName,
    inputs.branchCode,
    region,
    regionhead,
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
        (regionheads) => regionheads.regionCode === editedPost.regionCode
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
  }, [
    editedPost,
    vertical,
    branches,
    verticalhead,
    businesshead,
    region,
    regionhead,
  ]);

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

    if (name === "Branchname2") {
      const selectedBranch2 = branches.find(
        (branch) =>
          branch.regionCode === inputs.regionCode && branch.branchName === value
      );
      console.log("selectedBranch2:", selectedBranch2);
      setInputs((prevInputs) => ({
        ...prevInputs,
        Branchcode2: selectedBranch2 ? selectedBranch2.branchCode : "",
      }));
    }

    // Inside the handleChange function

    if (name === "Branchname3") {
      const selectedBranch3 = branches.find(
        (branch) =>
          branch.regionCode === inputs.regionCode && branch.branchName === value
      );
      console.log("selectedBranch3:", selectedBranch3);
      setInputs((prevInputs) => ({
        ...prevInputs,
        Branchcode3: selectedBranch3 ? selectedBranch3.branchCode : "",
      }));
    }

    if (name === "Branchname4") {
      const selectedBranch4 = branches.find(
        (branch) =>
          branch.regionCode === inputs.regionCode && branch.branchName === value
      );
      console.log("selectedBranch4:", selectedBranch4);
      setInputs((prevInputs) => ({
        ...prevInputs,
        Branchcode4: selectedBranch4 ? selectedBranch4.branchCode : "",
      }));
    }

    if (name === "Branchname5") {
      const selectedBranch5 = branches.find(
        (branch) =>
          branch.regionCode === inputs.regionCode && branch.branchName === value
      );
      console.log("selectedBranch5:", selectedBranch5);
      setInputs((prevInputs) => ({
        ...prevInputs,
        Branchcode5: selectedBranch5 ? selectedBranch5.branchCode : "",
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
        "http://localhost:8800/api/auth/adminuser",
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
    axios.get("http://localhost:8800/api/auth/userdata").then((res) => {
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
      selectedBranch2 &&
      selectedBranch3 &&
      selectedBranch4 &&
      selectedBranch5
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
        Branchcode2: selectedBranch2 ? selectedBranch2.branchCode : null,
        Branchcode3: selectedBranch3 ? selectedBranch3.branchCode : null,
        Branchcode4: selectedBranch4 ? selectedBranch4.branchCode : null,
        Branchcode5: selectedBranch5 ? selectedBranch5.branchCode : null,
      };

      axios
        .put(
          `http://localhost:8800/api/auth/edituser/${editedPost.id}`,
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
  }, [
    editedPost,
    region,
    branches,
    vertical,
    verticalhead,
    businesshead,
    regionhead,
  ]);

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
      Branchcode2: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchname2: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchcode3: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchname3: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchcode4: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchname4: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchcode5: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      Branchname5: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
      post.Branchcode2,
      post.Branchname2,
      post.Branchcode3,
      post.Branchname3,
      post.Branchcode4,
      post.Branchname4,
      post.Branchcode5,
      post.Branchname5,
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

  const samplecsv = [
    {
      employeeName: "",
      employeeCode: "",
      employeeDesignation: "",
      mobileNumber: "",
      emailId: "",
      regionCode: "",
      branchCode: "",
      verticalCode: "",
      Branchcode2: "",
      Branchcode3: "",
      Branchcode4: "",
      Branchcode5: "",
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
            let selectedRegion = null;
            let selectedRegionHead = null;
            let selectedBranch = null;
            let selectedVertical = null;
            let selectedVerticalHead = null;
            let selectedBusinessHead = null;

            if (row.regionCode) {
              selectedRegion = region.find(
                (regions) => regions.regionCode === row.regionCode
              );
            }

            if (selectedRegion) {
              selectedRegionHead = regionhead.find(
                (regionheads) =>
                  regionheads.regionCode === selectedRegion.regionCode
              );
            }

            if (row.branchCode && selectedRegion) {
              selectedBranch = branches.find(
                (branch) =>
                  branch.regionCode === selectedRegion.regionCode &&
                  branch.branchCode === row.branchCode
              );
            }

            if (row.verticalCode) {
              selectedVertical = vertical.find(
                (verticals) => verticals.verticalCode === row.verticalCode
              );
            }

            if (selectedVertical) {
              selectedVerticalHead = verticalhead.find(
                (verticalheads) =>
                  verticalheads.verticalCode === selectedVertical.verticalCode
              );
            }

            if (selectedVertical) {
              selectedBusinessHead = businesshead.find(
                (businessheads) =>
                  businessheads.verticalCode === selectedVertical.verticalCode
              );
            }

            await axios.post("http://localhost:8800/api/auth/adminuser", {
              employeeName: row.employeeName,
              employeeCode: row.employeeCode,
              employeeDesignation: row.employeeDesignation,
              mobileNumber: row.mobileNumber,
              emailId: row.emailId,
              regionCode: row.regionCode,
              regionName: selectedRegion ? selectedRegion.regionName : "",
              branchCode: row.branchCode,
              branchName: selectedBranch ? selectedBranch.branchName : "",
              verticalCode: row.verticalCode,
              verticalName: selectedVertical
                ? selectedVertical.verticalName
                : "",
              verticalHeadCode: selectedVerticalHead
                ? selectedVerticalHead.verticalHeadCode
                : "",
              verticalHeadName: selectedVerticalHead
                ? selectedVerticalHead.verticalHeadName
                : "",
              regionHeadCode: selectedRegionHead
                ? selectedRegionHead.regionHeadCode
                : "",
              regionHeadName: selectedRegionHead
                ? selectedRegionHead.regionHeadName
                : "",
              businessHeadCode: selectedBusinessHead
                ? selectedBusinessHead.businessHeadCode
                : "",
              businessHeadName: selectedBusinessHead
                ? selectedBusinessHead.businessHeadName
                : "",
              Branchcode2: row.Branchcode2,
              Branchname2: row.Branchname2,
              Branchcode3: row.Branchcode3,
              Branchname3: row.Branchname3,
              Branchcode4: row.Branchcode4,
              Branchname4: row.Branchname4,
              Branchcode5: row.Branchcode5,
              Branchname5: row.Branchname5,
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
        }}
      >
        Employee
      </p>

      <div>
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
                  Employee code
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="employeeCode"
                    name="employeeCode"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div>
                <label>
                  Employee Name
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="employeeName"
                    name="employeeName"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div>
                <label>
                  Mobile Number
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="mobileNumber"
                    name="mobileNumber"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div>
                <label>
                  Email ID
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="emailId"
                    name="emailId"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div>
                <label>
                  Employee Designation
                  <input
                    required
                    autoComplete="off"
                    className="userinput"
                    id="employeeDesignation"
                    name="employeeDesignation"
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
                    {filteredBranches.map((branch) => (
                      <option key={branch.branchName} value={branch.branchName}>
                        {branch.branchName}
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
                    id="branchCode"
                    name="branchCode"
                    value={inputs.branchCode || ""}
                    onChange={handleChange}
                  >
                    {filteredbranchCodes.map((branch) => (
                      <option key={branch.branchCode} value={branch.branchCode}>
                        {branch.branchCode}
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

              <div>
                <label>
                  Roles
                  <select
                    required
                    className="userinput"
                    id="role"
                    name="role"
                    onChange={handleChange}
                  >
                    <option value="">Select Role</option>
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Branch Name 2
                  <select
                    className="userinput"
                    id="Branchname2"
                    name="Branchname2"
                    value={inputs.Branchname2 || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Branch Name 2</option>
                    {filteredBranches.map((branch) => (
                      <option key={branch.branchName} value={branch.branchName}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div hidden>
                <label>
                  Branch Code 2
                  <select
                    className="userinput"
                    id="Branchcode2"
                    name="Branchcode2"
                    value={inputs.Branchcode2 || ""}
                    onChange={handleChange}
                  >
                    {filteredbranchCodes.map((branch) => (
                      <option key={branch.branchCode} value={branch.branchCode}>
                        {branch.branchCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Branch Name 3
                  <select
                    className="userinput"
                    id="Branchname3"
                    name="Branchname3"
                    value={inputs.Branchname3 || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Branch Name 3</option>
                    {filteredBranches.map((branch) => (
                      <option key={branch.branchName} value={branch.branchName}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div hidden>
                <label>
                  Branch Code 3
                  <select
                    className="userinput"
                    id="Branchcode3"
                    name="Branchcode3"
                    value={inputs.Branchcode3 || ""}
                    onChange={handleChange}
                  >
                    {filteredbranchCodes.map((branch) => (
                      <option key={branch.branchCode} value={branch.branchCode}>
                        {branch.branchCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Branch Name 4
                  <select
                    className="userinput"
                    id="Branchname4"
                    name="Branchname4"
                    value={inputs.Branchname4 || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Branch Name 4</option>
                    {filteredBranches.map((branch) => (
                      <option key={branch.branchName} value={branch.branchName}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div hidden>
                <label>
                  Branch Code 4
                  <select
                    className="userinput"
                    id="Branchcode4"
                    name="Branchcode4"
                    value={inputs.Branchcode4 || ""}
                    onChange={handleChange}
                  >
                    {filteredbranchCodes.map((branch) => (
                      <option key={branch.branchCode} value={branch.branchCode}>
                        {branch.branchCode}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Branch Name 5
                  <select
                    className="userinput"
                    id="Branchname5"
                    name="Branchname5"
                    value={inputs.Branchname5 || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Branch Name 5</option>
                    {filteredBranches.map((branch) => (
                      <option key={branch.branchName} value={branch.branchName}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div hidden>
                <label>
                  Branch Code 5
                  <select
                    className="userinput"
                    id="Branchcode5"
                    name="Branchcode5"
                    value={inputs.Branchcode5 || ""}
                    onChange={handleChange}
                  >
                    {filteredbranchCodes.map((branch) => (
                      <option key={branch.branchCode} value={branch.branchCode}>
                        {branch.branchCode}
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

          <input
            type="file"
            className="branchfile"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
        </div>
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
          <Button>
            <CSVLink
              data={samplecsv}
              filename={"sampleemployeedata"}
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
              marginRight: "20px",
              backgroundColor: "lightgreen",
              border: "none",
            }}
            title="Download CSV"
          />
        </div>
      </div>

      {/* <form className="formuser" onSubmit={handleSubmit}>

      </form> */}
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
        <Column field="employeeCode" sortable header="Employee Code"></Column>
        <Column field="employeeName" sortable header="Employee Name"></Column>
        <Column field="mobileNumber" sortable header="Mobile Number"></Column>
        <Column field="emailId" sortable header="Email ID"></Column>
        <Column
          field="employeeDesignation"
          sortable
          header="Employee Designation"
        ></Column>
        <Column field="regionCode" sortable header="Region Code"></Column>
        <Column field="regionName" sortable header="Region Name"></Column>
        <Column
          field="regionHeadName"
          sortable
          header="Region Head Name"
        ></Column>
        <Column
          field="regionHeadCode"
          sortable
          header="Region Head Code"
        ></Column>
        <Column field="branchName" sortable header="Branch Name"></Column>
        <Column field="branchCode" sortable header="Branch Code"></Column>
        <Column field="verticalName" sortable header="Vertical Name"></Column>
        <Column field="verticalCode" sortable header="Vertical Code"></Column>
        <Column
          field="verticalHeadName"
          sortable
          header="Vertical Head Name"
        ></Column>
        <Column
          field="verticalHeadCode"
          sortable
          header="Vertical Head Code"
        ></Column>
        <Column
          field="businessHeadName"
          sortable
          header="Business Head Name"
        ></Column>
        <Column
          field="businessHeadCode"
          sortable
          header="Business Head Code"
        ></Column>
        <Column field="Branchname2" sortable header="Branch Name 2"></Column>
        <Column field="Branchcode2" sortable header="Branch Code 2"></Column>
        <Column field="Branchname3" sortable header="Branch Name 3"></Column>
        <Column field="Branchcode3" sortable header="Branch Code 3"></Column>
        <Column field="Branchname4" sortable header="Branch Name 4"></Column>
        <Column field="Branchcode4" sortable header="Branch Code 4"></Column>
        <Column field="Branchname5" sortable header="Branch Name 5"></Column>
        <Column field="Branchcode5" sortable header="Branch Code "></Column>
        <Column field="role" sortable header="Role"></Column>
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
      <Dialog
        header="Update User Data"
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
                <label htmlFor="employeeDesignation">
                  Employee Designation
                </label>
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
                    <option
                      key={verticals.verticalCode}
                      value={verticals.verticalCode}
                    >
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
                    <option
                      key={verticals.verticalName}
                      value={verticals.verticalName}
                    >
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
                    <option
                      key={verticalheads.verticalHeadName}
                      value={verticalheads.verticalHeadName}
                    >
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
                    <option
                      key={verticalheads.verticalHeadCode}
                      value={verticalheads.verticalHeadCode}
                    >
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
                    <option
                      key={businessheads.businessHeadName}
                      value={businessheads.businessHeadName}
                    >
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
                    <option
                      key={businessheads.businessHeadCode}
                      value={businessheads.businessHeadCode}
                    >
                      {businessheads.businessHeadCode}
                    </option>
                  ))}
                </select>
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
            <Button label="Save" icon="pi pi-check" onClick={saveEditedPost} />
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default User;
