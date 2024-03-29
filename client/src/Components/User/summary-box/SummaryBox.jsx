import React,{ useEffect, useState, useContext }  from 'react'
import './summary-box.scss'
import Box from '../box/Box'
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { colors } from '../../../constants'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
import 'react-circular-progressbar/dist/styles.css';
import { fetchData } from '../../../constants/data';
import { AuthContext } from '../../../context/authContext';

const SummaryBox = ({ item }) => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetchData()
      .then(counts => {
        if (counts !== undefined) {
          if (item.title === "Investments") {
            setCount(counts[0]);
            item.percent = Math.min(((counts[0] / counts[3]) * 100).toFixed(1), 100); // Calculate percentage for Investments relative to Order book and limit to 100%
          } else if (item.title === "Home Loans") {
            setCount(counts[1]);
            item.percent = Math.min(((counts[1] / counts[3]) * 100).toFixed(1), 100); // Calculate percentage for Home Loans relative to Order book and limit to 100%
          } else if (item.title === "Insurance") {
            setCount(counts[2]);
            item.percent = Math.min(((counts[2] / counts[3]) * 100).toFixed(1), 100); // Calculate percentage for Insurance relative to Order book and limit to 100%
          } else if (item.title === "Order book") {
            setCount(counts[3]);
            item.percent = 100; // Set the percentage for Order book to 100%
          }
        }
      })
      .catch(error => console.error(error));
  }, [item]);

  return (
    <Box>
      <div className='summary-box'>
        <div className="summary-box__info">
          <div className="summary-box__info__title">
            <div>{item.title}</div>
            <span>{item.subtitle}</span>
          </div>
          <div className="summary-box__info__value">
            {count != null ? `${count}` : 'Loading...'}
          </div>
        </div>
        <div className="summary-box__chart">
          <CircularProgressbarWithChildren
            value={item.percent}
            strokeWidth={10}
            styles={buildStyles({
              pathColor: item.icon < 50 ? colors.red : colors.purple,
              trailColor: 'transparent',
              strokeLinecap: 'round'
            })}
          >
            <div className="summary-box__chart__value">
              {item.percent}%
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </div>
    </Box>
  );
};

export default SummaryBox;

export const SummaryBoxSpecial = ({ item }) => {
    const chartOptions = {
        responsive: true,
        scales: {
            xAxis: {
                display: false
            },
            yAxis: {
                display: false
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        elements: {
            point: {
                radius: 0
            }
        }
    }

    const chartData = {
        labels: item.chartData.labels,
        datasets: [
            {
                label: 'Revenue',
                data: item.chartData.data,
                borderColor: '#fff',
                tension: 0.5
            }
        ]
    }
    return (
        <Box purple fullheight>
            <div className="summary-box-special">
                <div className="summary-box-special__title">
                    {item.title}
                </div>
                <div className="summary-box-special__value">
                    {item.value}
                </div>
                <div className="summary-box-special__chart">
                    <Line options={chartOptions} data={chartData} width={`250px`} />
                </div>
            </div>
        </Box>
    )
}
