import React from 'react'
import './Dashboard.scss'
import { Bar } from 'react-chartjs-2'
import Box from '../../../Components/Admin/box/Box'
import DashboardWrapper, { DashboardWrapperMain, DashboardWrapperRight } from '../../../Components/Admin/dashboard-wrapper/DashboardWrapper'
import SummaryBox, { SummaryBoxSpecial } from '../../../Components/Admin/summary-box/SummaryBox'
import { colors } from '../../../constants'
import { data } from '../../../constants/admindata'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import OverallList from '../../../Components/Admin/overall-list/OverallList'
import RevenueList from '../../../Components/Admin/revenue-list/RevenueList'
import UserInfo from '../../../Components/Admin/user-info/UserInfo'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend
)


const adminDashboard = () => {
    return (
        <DashboardWrapper>
            <DashboardWrapperMain>
                <div className="row">
                    <div className="col-12 col-md-12">
                        <div className="row">
                            {
                                data.summary.map((item, index) => (
                                    <div key={`summary-${index}`} className="col-6 col-md-6 col-sm-12 mb">
                                        <SummaryBox item={item} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    {/* <div className="col-4 hide-md">
                        <SummaryBoxSpecial item={data.revenueSummary} />
                    </div> */}
                </div>
                <div className="row">
                    <div className="col-12">
                        <Box>
                            <RevenueByMonthsChart />
                        </Box>
                    </div>
                </div>
            </DashboardWrapperMain>
            <DashboardWrapperRight>
                <div className='user'>
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
    )
}

export default adminDashboard

const RevenueByMonthsChart = () => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: {
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            yAxes: {
                grid: {
                    display: false,
                    drawBorder: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
        },
        elements: {
            bar: {
                backgroundColor: colors.orange,
                borderRadius: 20,
                borderSkipped: 'bottom'
            }
        }
    }

    const chartData = {
        labels: data.revenueByMonths.labels,
        datasets: [
            {
                label: 'Revenue',
                data: data.revenueByMonths.data
            }
        ]
    }
    return (
        <>
            <div className="title mb">
                Revenue by months
            </div>
            <div>
                <Bar options={chartOptions} data={chartData} height={`300px`} />
            </div>
        </>
    )
}