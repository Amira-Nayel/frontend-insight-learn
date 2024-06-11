import { useEffect, useState } from "react";
import TotalSessionsGraph from "./graphs/TotalSessionsGraph";
import AverageReportsGraph from "./graphs/AverageReportsGraph";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import QuizReportGraph from "./graphs/QuizReportGraph";
// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);
const MainDash = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch users
                const usersResponse = await fetch('https://dj-render-ldb1.onrender.com/fetchuserdata', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const usersData = await usersResponse.json();
                setUsers(usersData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);
    const maleUsers = users.filter(user => user.Gender === 'Male').length;
    const femaleUsers = users.filter(user => user.Gender === 'Female').length;
    const totalUsers = maleUsers + femaleUsers;
    const genderData = {
        labels: ['Male', 'Female'],
        datasets: [
            {
                data: [maleUsers, femaleUsers],
                backgroundColor: ['#36A2EB', '#FF6384'],
            }
        ]
    };
    const genderOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const value = tooltipItem.raw;
                        const percentage = ((value / totalUsers) * 100).toFixed(2) + '%';
                        return `${tooltipItem.label}: ${percentage}`;
                    }
                }
            },
            legend: {
                display: true,
                position: 'top'
            }
        }
    };
    const bins = ['0 - 1', '1 - 2', '2 - 3', '3 - 3.5', '3.5 - 4'];
    const binCounts = bins.map(bin => {
        const [min, max] = bin.split('-').map(Number);
        return users.filter(user => user.CGPA >= min && user.CGPA < max).length;
    });
    const cgpaHistogramData = {
        labels: bins,
        datasets: [
            {
                label: 'Students',
                data: binCounts,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.7)',
                hoverBorderColor: 'rgba(75,192,192,1)',
            }
        ]
    };
    if (isLoading) {
        return <div className='bg-c_3 dark:bg-dark-grey justify-center items-center rounded-lg flex p-5'>
            <img className="w-[20vw] animate-pulse" src="/images/logo.png" alt="" />
        </div>;
    }
    return (
        <div className="flex flex-wrap overflow-auto gap-5 h-[90dvh] justify-around">
                <div className="flex flex-wrap gap-5">
                    <div className="w-auto h-fit overflow-auto p-3 dark:text-white dark:bg-black bg-c_4 bg-opacity-25 dark:bg-opacity-15 rounded shadow">
                        <h2 className="text-xl font-bold mb-2">Total Students</h2>
                        <p>{isLoading ? "Loading..." : users.length}</p>
                    </div>
                </div>
            <div className="flex flex-wrap gap-5 h-auto justify-around basis-[100%]">
                <div className="flex flex-wrap justify-center items-center max-sm:justify-start max-sm:items-start gap-5 max-w-[70vw] overflow-auto">
                    <div className=" h-fit overflow-auto w-[30vw] max-sm:w-[40vw] p-4 dark:text-white dark:bg-black bg-c_4 bg-opacity-25 dark:bg-opacity-15 rounded shadow">
                        <div className="flex justify-center items-center gap-5 w-auto">
                            <div className="w-auto h-fit overflow-auto p-3 dark:text-white dark:bg-black bg-c_4 bg-opacity-25 dark:bg-opacity-15 rounded shadow">
                                <h2 className="text-xl font-bold mb-2">Male</h2>
                                <p>{isLoading ? "Loading..." : maleUsers}</p>
                            </div>
                            <div className="w-auto h-fit overflow-auto p-3 dark:text-white dark:bg-black bg-c_4 bg-opacity-25 dark:bg-opacity-15 rounded shadow">
                                <h2 className="text-xl font-bold mb-2">Female</h2>
                                <p>{isLoading ? "Loading..." : femaleUsers}</p>
                            </div>
                        </div>
                        <div className="md:max-w-[250px]">
                            {isLoading ? "Loading..." : <Pie data={genderData} options={genderOptions} />}
                        </div>
                    </div>
                    <div className=" h-fit min-w-[400px] overflow-auto dark:text-white p-4 dark:bg-black dark:bg-opacity-15 bg-c_4 bg-opacity-25 rounded shadow">
                        <h2 className="text-xl font-bold mb-2">CGPA Distribution</h2>
                        {isLoading ? "Loading..." : <Bar data={cgpaHistogramData} />}
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center flex-wrap">
            </div>
            <div className=" basis-[100%] overflow-x-auto p-4  dark:text-white dark:bg-black dark:bg-opacity-15 bg-c_4 bg-opacity-25 rounded shadow">
                <h2 className="text-xl font-bold mb-2">Quiz Grades Pie Chart</h2>
                <QuizReportGraph />
            </div>
            <div className=" basis-[100%] overflow-auto p-4 dark:text-white dark:bg-black bg-c_4 bg-opacity-25 dark:bg-opacity-15 rounded shadow">
                <h2 className="text-xl font-bold mb-2">Total Session Duration Graph</h2>
                <TotalSessionsGraph />
            </div>
            <div className=" basis-[100%] overflow-x-auto p-4 dark:text-white dark:bg-black bg-c_4 bg-opacity-25 dark:bg-opacity-15 rounded shadow">
                <AverageReportsGraph />
            </div>
        </div>
    )
}
export default MainDash;
