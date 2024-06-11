import { useEffect, useState } from 'react';
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
    const [sessions, setSessions] = useState([]);
    const [filterEmail, setFilterEmail] = useState('');
    const [filterSessionType, setFilterSessionType] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('https://dj-render-ldb1.onrender.com/unique/') // Replace with your API URL
            .then(response => response.json())
            .then(data => {
                const normalizedData = data.map(session => {
                    if (session.session_for === '') {
                        session.session_for = 'assignment';
                    }
                    return {
                        ...session,
                        average_arousal: normalize(session.average_arousal),
                        average_valence: normalize(session.average_valence)
                    };
                });
                setSessions(normalizedData);
                setIsLoading(false);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const normalize = (value) => {
        return value / 100;
    };

    const filterSessions = () => {
        return sessions.filter(session => {
            return session.userEmail.includes(filterEmail) 
                && (filterSessionType === '' || session.session_for === filterSessionType);
        });
    };

    const groupByDuration = (sessions) => {
        const durations = [10, 20, 30];
        const grouped = {};

        durations.forEach(duration => {
            grouped[duration] = {
                avgAttention: [],
                avgArousal: [],
                avgValence: []
            };
        });

        sessions.forEach(session => {
            const sessionDuration = session.Session_Duration;
            durations.forEach(duration => {
                if (sessionDuration >= duration) {
                    grouped[duration].avgAttention.push(session.average_attention);
                    grouped[duration].avgArousal.push(session.average_arousal);
                    grouped[duration].avgValence.push(session.average_valence);
                }
            });
        });

        const calculateAverages = (values) => values.reduce((a, b) => a + b, 0) / values.length || 0;

        return durations.map(duration => ({
            duration: `${duration}+ minutes`,
            avgAttention: calculateAverages(grouped[duration].avgAttention),
            avgArousal: calculateAverages(grouped[duration].avgArousal),
            avgValence: calculateAverages(grouped[duration].avgValence)
        }));
    };

    const filteredSessions = filterSessions();
    const groupedData = groupByDuration(filteredSessions);

    const labels = groupedData.map(group => group.duration);
    const avgAttentionData = groupedData.map(group => group.avgAttention);
    const avgArousalData = groupedData.map(group => group.avgArousal);
    const avgValenceData = groupedData.map(group => group.avgValence);

    const attentionChartData = {
        labels: labels,
        datasets: [
            {
                label: 'Average Attention',
                data: avgAttentionData,
                backgroundColor: 'rgb(75, 192, 192, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    const valenceArousalChartData = {
        labels: labels,
        datasets: [
            {
                label: 'Average Arousal',
                data: avgArousalData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Average Valence',
                data: avgValenceData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Average Levels by Session Duration',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Session Duration',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Levels',
                },
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
        <div className="flex flex-wrap gap-5">
            <div className='flex flex-col'>
                <div className=' flex self-center sm:min-w-[400px] mb-8 min-w-[600px] md:w-[70vw] overflow-auto'>
                    <Bar data={attentionChartData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Average Attention by Session Duration' } } }} />
                </div>

                <div className=' flex self-center sm:min-w-[400px] min-w-[600px] md:w-[70vw] overflow-auto'>
                    <Bar data={valenceArousalChartData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Average Arousal and Valence by Session Duration' } } }} />
                </div>

                <div className='flex flex-wrap gap-1'>
                    <input 
                        type="text" 
                        placeholder="Filter by email" 
                        value={filterEmail} 
                        onChange={e => setFilterEmail(e.target.value)} 
                        className="mb-4 p-2 dark:bg-black dark:bg-opacity-25 dark:text-white border border-c_4 rounded"
                    />
                    <select 
                        value={filterSessionType} 
                        onChange={e => setFilterSessionType(e.target.value)} 
                        className="mb-4 p-2  dark:bg-black dark:bg-opacity-25 dark:text-white border border-c_4  rounded"
                    >
                        <option value="">All session types</option>
                        <option value="assignment">Assignment</option>
                        <option value="SA-quiz">SA-quiz</option>
                        <option value="MOT-quiz">MOT-quiz</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Reports;
