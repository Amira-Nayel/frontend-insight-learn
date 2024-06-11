/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

// Register chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserReports = () => {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentUserEmail = localStorage.getItem('email');
    
    useEffect(() => {
        fetch('https://dj-render-ldb1.onrender.com/unique/')
            .then(response => response.json())
            .then(data => {
                const userSessions = data.filter(session => session.userEmail === currentUserEmail);
                const modifiedData = userSessions.map(session => {
                    if (session.session_for === '') {
                        session.session_for = 'assignment';
                    }
                    return session;
                });
                setSessions(modifiedData);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [currentUserEmail]);

    if (isLoading) {
        return <div className='bg-c_3 dark:bg-dark-grey justify-center items-center rounded-lg flex p-5'>
            <img className="w-[20vw] animate-pulse" src="/images/logo.png" alt="" />
        </div>;
    }

    const chartData = {
        labels: sessions.map(session => session.session_for),
        datasets: [
            {
                label: 'Average Attention',
                data: sessions.map(session => session.average_attention),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    if (isLoading) {
        return <div className='bg-c_3 dark:bg-dark-grey justify-center items-center rounded-lg flex p-5'>
            <img className="w-[20vw] animate-pulse" src="/images/logo.png" alt="" />
        </div>;
    }

    return (
        <div className="flex flex-col justify-center items-center gap-5 h-[80dvh] w-[70vw]">
            <div className="flex flex-col overflow-auto w-[60vw] h-[40vh]">
                <table className="divide-y divide-c_4">
                    <thead className="bg-gray-50 dark:text-white dark:bg-black dark:bg-opacity-25">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session For</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Started</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Ended</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Duration Text</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Attention</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:text-white dark:bg-black dark:bg-opacity-25 divide-y divide-c_4">
                        {sessions.map((session, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{session.session_for}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{session.Session_Started}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{session.Session_Ended}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{session.Session_Duration_Txt}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{session.average_attention}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col overflow-auto w-[60vw] h-[40vh]">
                <div className="flex min-w-[600px]">
                    <Bar data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default UserReports;