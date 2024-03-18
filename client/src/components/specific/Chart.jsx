import React from 'react';
import { Line, Doughnut } from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    Tooltip,
    Filler,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend
} from "chart.js";
import { getLast7Days } from '../../lib/Features';
import { blue, green } from '@mui/material/colors';

ChartJS.register(CategoryScale,
    Tooltip,
    Filler,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend
);

const LineChartOptions = {

    responsive: true,
    plugins: {
        Legend: {
            display: false
        },
        title: {
            display: false
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false
            }
        }

    }
}

const label = getLast7Days();

const LineChart = ({ value = [] }) => {
    let data = {
        labels: label,
        datasets: [{
            data: value,
            label: "Revenue",
            fill: true,
            backgroundColor: "#ffb3b3",
            borderColor: "#660000"
        }]
    }
    return (
        <Line data={data} options={LineChartOptions} />
    )
}

const DoughnutChartOptions = {
    responsive: true,
    plugins: {
        Legend: {
            display: false
        },
        title: {
            display: false
        }
    },
   cutout:100
}

const DoughnutChart = ({ value = [], labels = [] }) => {
    const blue = "blue"; 
    const green = "green";

    const data = {
        labels: labels,
        datasets: [{
            data: value,
            label: "Single Chats vs Group Chats",
            backgroundColor: ["lightblue", "lightgreen"],
            borderColor: [blue, green],
            offset:20
        }]
    };

    return <Doughnut data={data} style={{zIndex:10}} options={DoughnutChartOptions} />;
};


export { LineChart, DoughnutChart };