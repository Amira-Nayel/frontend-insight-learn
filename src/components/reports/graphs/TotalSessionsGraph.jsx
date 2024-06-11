/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const TotalSessionsGraph = () => {
    const [sessions, setSessions] = useState([]);
    const [filterEmail, setFilterEmail] = useState('');
    const [filterDuration, setFilterDuration] = useState('');
    const [filterSessionType, setFilterSessionType] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetch('https://dj-render-ldb1.onrender.com/unique/') // Replace with your API URL
        .then(response => response.json())
        .then(data => {
            const modifiedData = data.map(session => {
                    if (session.session_for === '') {
                        session.session_for = 'assignment';
                    }
                    return session;
                });
                setSessions(modifiedData);
                setIsLoading(false);
            })
            .catch(error => console.error('Error:', error));
    }, []);
    const filteredSessions = sessions.filter(session => {
        return session.userEmail.includes(filterEmail) 
            && session.Session_Duration >= filterDuration
            && (filterSessionType === '' || session.session_for === filterSessionType);
    });
    const chartData = {
        labels: filteredSessions.map((session, index) => `Session ${index + 1}`),
        datasets: [
            {label: 'Session Duration',data: filteredSessions.map(session => session.Session_Duration),fill: true,
                backgroundColor: 'rgb(75, 192, 192)',borderColor: 'rgba(75, 192, 192, 0.2)',
                userEmail: filteredSessions.map(session => session.userEmail),
            },
        ],
    };
    const chartOptions = {
        plugins: {tooltip: {callbacks: {
                    label: function(context) {
                        const userEmail = context.dataset.userEmail[context.dataIndex];
                        return [
                            `Session ${context.dataIndex + 1}: ${context.parsed.y}`,
                            `Email: ${userEmail}`
                        ];
    }}}}};
    if (isLoading) {
        return <div className='bg-c_3 dark:bg-dark-grey justify-center items-center rounded-lg flex p-5'>
            <img className="w-[20vw] animate-pulse" src="/images/logo.png" alt="" />
        </div>;
    }

    return (
        <div className='flex flex-col justify-start gap-5 items-start'>
            <div className='max-sm:h-fit  sm:h-fit min-w-[800px] md:w-[70vw]'>
                <Line data={chartData} options={chartOptions} />
            </div>
            <div className='flex flex-wrap gap-1 justify-center items-center self-center'>
                <input 
                    type="text" 
                    placeholder="Filter by email" 
                    value={filterEmail} 
                    onChange={e => setFilterEmail(e.target.value)} 
                    className="mb-4 p-2 w-[60%] border-c_4 dark:bg-black dark:bg-opacity-25 dark:text-white border border-gray-300 rounded"
                />
                <select 
                    value={filterSessionType} 
                    onChange={e => setFilterSessionType(e.target.value)} 
                    className="mb-4 p-2 border border-c_4 dark:bg-black dark:bg-opacity-25 dark:text-white border-gray-300 rounded"
                >
                    <option value="">All session types</option>
                    <option value="assignment">Assignment</option>
                    <option value="SA-quiz">SA-quiz</option>
                    <option value="MOT-quiz">MOT-quiz</option>
                </select>
                <select 
                    value={filterDuration} 
                    onChange={e => setFilterDuration(e.target.value)} 
                    className="mb-4 p-2 border border-c_4 dark:bg-black dark:bg-opacity-25 dark:text-white border-gray-300 rounded"
                >
                    <option value="">All durations</option>
                    <option value="10">10+ minutes</option>
                    <option value="20">20+ minutes</option>
                    <option value="30">30+ minutes</option>
                </select>
            </div>
        </div>
    );
}

export default TotalSessionsGraph;