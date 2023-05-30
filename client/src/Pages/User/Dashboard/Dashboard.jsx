import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import "./Dashboard.scss";
import "./Dashboard.css";
import { Bar } from "react-chartjs-2";
import Box from "../../../Components/User/box/Box";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../../Components/User/dashboard-wrapper/DashboardWrapper";
import SummaryBox, {
  SummaryBoxSpecial,
} from "../../../Components/User/summary-box/SummaryBox";
import { colors, data } from "../../../constants";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import OverallList from "../../../Components/User/overall-list/OverallList";
import RevenueList from "../../../Components/User/revenue-list/RevenueList";
import UserInfo from "../../../Components/User/user-info/UserInfo";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/auth/dashboardlead`
        );
        const filteredPosts = response.data.filter(
          (post) => post.employeeCode === currentUser.employeeCode
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [currentUser, fromDate, toDate]);

  return (
    <DashboardWrapper>
      <DashboardWrapperMain>
        <div className="row">
          <div className="col-12 col-md-12">
            <div className="row">
              {data.summary.map((item, index) => (
                <div
                  key={`summary-${index}`}
                  className="col-6 col-md-6 col-sm-12 mb"
                >
                  <SummaryBox item={item} />
                </div>
              ))}
            </div>
          </div>
          {/* <div className="col-4 hide-md">
                        <SummaryBoxSpecial item={data.revenueSummary} />
                    </div> */}
        </div>
        <div className="row">
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
          >
            <Column field="leadRefID" sortable header="leadRefID"></Column>
            <Column field="employeeCode" sortable header="employeeCode"></Column>
            <Column field="employeeName" sortable header="employeeName"></Column>
          </DataTable>
        </div>
      </DashboardWrapperMain>
      <DashboardWrapperRight>
        <div className="user">
          <UserInfo user={data.user} />
        </div>
        <div className="title mb">Overall</div>
        <div className="mb">
          <OverallList />
        </div>
        {/* <div className="title mb">Revenue by channel</div>
                <div className="mb">
                    <RevenueList />
                </div> */}
      </DashboardWrapperRight>
    </DashboardWrapper>
  );
};

export default Dashboard;

const RevenueByMonthsChart = () => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      yAxes: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    elements: {
      bar: {
        backgroundColor: colors.orange,
        borderRadius: 20,
        borderSkipped: "bottom",
      },
    },
  };

  const chartData = {
    labels: data.revenueByMonths.labels,
    datasets: [
      {
        label: "Revenue",
        data: data.revenueByMonths.data,
      },
    ],
  };
  return (
    <>
      <div className="title mb">Revenue by months</div>
      <div>
        <Bar options={chartOptions} data={chartData} height={`300px`} />
      </div>
    </>
  );
};
