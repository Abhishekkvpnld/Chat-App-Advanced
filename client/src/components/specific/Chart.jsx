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

const LineChart = ({ value = [] }) => {
    let data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July"],
        datasets: [{
            data: [1, 2, 36, 10, 25, 6, 2, 40],
            label: "Revenue",
            fill: true,
            backgroundColor: "lightblue",
            borderColor: "rgba(75,192,192,1)"
        }]
    }
    return (
        <Line data={data} options={LineChartOptions} />
    )
}

const DoughnutChart = () => {
    return (
        <div>chart</div>
    )
}

export { LineChart, DoughnutChart };