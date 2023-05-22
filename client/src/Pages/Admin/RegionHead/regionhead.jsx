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
import "./regionhead.css";
import { data } from "../../../constants/admindata";
import UserInfo from "../../../Components/Admin/user-info/UserInfo";

const Regionhead = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({});
    const [editedPost, setEditedPost] = useState(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);

    const [err, setErr] = useState(null);
    const [msg, setMsg] = useState(null);

    const [inputs, setInputs] = useState({
        regionName: "",
        productName: "",
        principal: "",
    });

    const [region, setregion] = useState([]);
    const [product, setProduct] = useState([]);
    const [filteredregions, setFilteredregions] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showAdditionaluser, setShowAdditionaluser] = useState(false);

    useEffect(() => {
        const fetchregion = async () => {
            const res = await axios.get(
                "http://localhost:8800/api/auth/getregioninprincipal"
            );
            setregion(res.data);
        };
        const fetchProduct = async () => {
            const res = await axios.get(
                "http://localhost:8800/api/auth/getproductinprincipal"
            );
            setProduct(res.data);
        };
        fetchregion();
        fetchProduct();
    }, []);

    useEffect(() => {
        if (inputs.regionName) {
            const filteredregions = region.filter(
                (regions) => regions.regionName === inputs.regionName
            );
            setFilteredregions(filteredregions);

            const filteredProducts = product.filter(
                (products) => products.regionName === inputs.regionName
            );
            setFilteredProducts(filteredProducts);
        } else {
            setFilteredregions([]);
            setFilteredProducts([]);
        }
    }, [inputs.regionName, region, product]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));

        if (name === "regionName") {
            const selectedregion = region.find(
                (regions) => regions.regionName === value
            );
            console.log("selectedregion:", selectedregion);
            setInputs((prevInputs) => ({
                ...prevInputs,
                regionName: value,
                productName: "", // Reset the productName when changing the regionName
            }));

            // Update filteredProducts based on selected regionName
            const filteredProducts = product.filter(
                (products) => products.regionName === value
            );
            setFilteredProducts(filteredProducts);
        }

        if (name === "productName") {
            setInputs((prevInputs) => ({
                ...prevInputs,
                productName: value,
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8800/api/auth/adminregionhead",
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
        axios.get("http://localhost:8800/api/auth/regionheaddata").then((res) => {
            setPosts(res.data);
        });
    }, []);

    const saveEditedPost = () => {
        axios
            .put(
                `http://localhost:8800/api/auth/editregionhead/${editedPost.id}`,
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
            regionHeadCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            regionHeadName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            regionCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            regionName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
        link.setAttribute("download", "regionheadmaster.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const samplecsv = [
        {
            id: "",
            regionHeadCode: "",
            regionHeadName: "",
            regionCode: "",
            regionName: "",
        },
    ];

    const handleFileUpload = (file) => {
        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                const { data } = results;
                const filteredData = data.filter((row) => {
                    // Check if all values in the row are empty or not
                    return Object.values(row).some((value) => value.trim() !== "");
                });
                for (let i = 0; i < filteredData.length; i++) {
                    const row = filteredData[i];
                    try {
                        await axios.post("http://localhost:8800/api/auth/adminregionhead", row);
                        console.log(`Inserted row ${i + 1}: ${JSON.stringify(row)}`);
                    } catch (err) {
                        console.error(
                            `Error inserting row ${i + 1}: ${JSON.stringify(row)}`
                        );
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

            <div className="suser">
                <UserInfo user={data.user} />
            </div>
            <p
                style={{
                    fontSize: "20px",
                }}
            >
                Region Head
            </p>

            {/* <div>
      <p
        type="button"
        className="Addbuttonuser"
        onClick={() => setShowAdditionaluser(true)}
      >
        <i className="fa fa-plus"></i>Click Here to Create Principal{" "}
      </p>

      <div className={`additional-user ${showAdditionaluser ? "show" : ""}`}>
        <div className="form-container-user">
          <form className="formuser" onSubmit={handleSubmit}>
            <div>
              <label>
                region Name
                <select
                  required
                  className="userinput"
                  id="regionName"
                  name="regionName"
                  value={inputs.regionName || ""}
                  onChange={handleChange}
                >
                  <option value="">Select region Name</option>
                  {region.map((regions) => (
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
                Product Name
                <select
                  className="userinput"
                  id="productName"
                  name="productName"
                  value={inputs.productName || ""}
                  onChange={handleChange}
                >
                  {filteredregions.map((product) => (
                    <option
                      key={product.productName}
                      value={product.productName}
                    >
                      {product.productName}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label>
                Principal
                <input
                  required
                  className="userinput"
                  id="principal"
                  name="principal"
                  onChange={handleChange}
                />
              </label>
            </div>

            <button type="submit" className="Submitbuttonuser">
              Submit
            </button>
          </form>
        </div>

        <input
          type="file"
          className="userfile"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          style={{ flex: "" }}
        />

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
          <Button style={{ flex: "" }}>
            <CSVLink
              data={samplecsv}
              filename={"samplebranchdata"}
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
              flex: "",
              marginRight: "0px",
              backgroundColor: "lightgreen",
              border: "none",
            }}
            title="Download CSV"
          />
        </div>

        {err && (
          <>
            <div className="popup-background"></div>
            <div className="popup-wrapper">
              <p className="investmsgp">{err}</p>
              <div className="investmsg-buttons">
                <a href="/admin/principalmaster">
                  <button className="investmsg-no" onClick={() => setErr(null)}>
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
              <a href="/admin/principalmaster">
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
      </div>
      </div> */}

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
                <Column field="regionHeadCode" sortable header="Region Head Code"></Column>
                <Column field="regionHeadName" sortable header="Region Head Name"></Column>
                <Column field="regionCode" sortable header="Region Code"></Column>
                <Column field="regionName" sortable header="Region Name"></Column>
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
                header="Edit Region Head Data"
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
                                <label htmlFor="regionHeadCode">Region Head Code</label>
                                <InputText
                                    id="regionHeadCode"
                                    value={editedPost.regionHeadCode}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            regionHeadCode: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="regionHeadName">Region Head Name</label>
                                <InputText
                                    id="regionHeadName"
                                    value={editedPost.regionHeadName}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            regionHeadName: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="regionCode">Region Code</label>
                                <InputText
                                    id="regionCode"
                                    value={editedPost.regionCode}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            regionCode: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="p-field" style={{ paddingBottom: "10px" }}>
                                <label htmlFor="regionName">Region Name</label>
                                <InputText
                                    id="regionName"
                                    value={editedPost.regionName}
                                    onChange={(e) =>
                                        setEditedPost({
                                            ...editedPost,
                                            regionName: e.target.value,
                                        })
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

export default Regionhead;