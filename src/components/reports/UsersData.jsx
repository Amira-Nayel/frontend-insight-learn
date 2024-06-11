import { useState, useEffect } from 'react';
import axios from 'axios';

const DataTable = () => {
    const [sessions, setSessions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [itemsPerPage, setItemsPerPage] = useState(1000);
    const [filterEmail, setFilterEmail] = useState('');
    const [filterSessionType, setFilterSessionType] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const fetchData = () => {
        axios.get('https://dj-render-ldb1.onrender.com/view/')
        .then(response => {
            const modifiedData = response.data['users-data'].map(session => {
                if (session.Session_for === '') {
                    session.Session_for = 'assignment';
                }
                return session;
            });
            setSessions(modifiedData);
            setIsLoading(false);
        })
        .catch(error => console.error('Error:', error));
    };
    
    useEffect(() => {
        const interval = setInterval(fetchData, 5000);
        
        return () => clearInterval(interval);
    }, []);
    
    const refreshData = () => {
        fetchData();
        setCurrentPage(1);
    };
    if (isLoading) {
        return <div className='bg-c_3 dark:bg-dark-grey justify-center items-center rounded-lg flex p-5'>
            <img className="w-[20vw] animate-pulse" src="/images/logo.png" alt="" />
        </div>;
    }
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const filteredSessions = sessions.filter(session => {
    return session.userEmail.includes(filterEmail) 
        && (filterSessionType === '' || session.Session_for === filterSessionType);
    });
    const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
    const paginatedData = filteredSessions
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (
    <div className="flex flex-col justify-around items-center gap-4 container mx-auto px-4">
        <div className='flex justify-center items-center gap-5'>
            <input 
                type="text" 
                placeholder="Filter by email" 
                value={filterEmail} 
                onChange={e => setFilterEmail(e.target.value)} 
                className="p-2 dark:bg-black dark:bg-opacity-25 dark:text-white w-[60%] border border-c_4  rounded"
            />
            <select 
                value={filterSessionType} 
                onChange={e => setFilterSessionType(e.target.value)} 
                className="p-2 dark:bg-black dark:bg-opacity-25 dark:text-white border border-c_4  rounded"
            >
                <option value="">All session types</option>
                <option value="assignment">Assignment</option>
                <option value="SA-quiz">SA-quiz</option>
                <option value="MOT-quiz">MOT-quiz</option>
                <option value="MOT-lecture">MOT-lecture</option>
            </select>
            <button onClick={() => refreshData()} className=" p-2 border border-c_4 bg-c_4 hover:bg-opacity-30 transition-all duration-200 text-white rounded">Refresh</button>
        </div>
        <div className="flex self-center shadow h-[70dvh] dark:bg-black dark:bg-opacity-25 dark:text-white w-[80vw] overflow-scroll border-b border-gray-200 sm:rounded-lg">
            <table className="divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 border border-c_4 py-2">ID</th>
                        <th className="px-4 border border-c_4 py-2">Email</th>
                        <th className="px-4 border border-c_4 py-2">Session For</th>
                        <th className="px-4 border border-c_4 py-2">Session Started At</th>
                        <th className="px-4 border border-c_4 py-2">Capture Time</th>
                        <th className="px-4 border border-c_4 py-2">Session Ended At</th>
                        <th className="px-4 border border-c_4 py-2">Arousal</th>
                        <th className="px-4 border border-c_4 py-2">Attention</th>
                        <th className="px-4 border border-c_4 py-2">Dominant Emotion</th>
                        <th className="px-4 border border-c_4 py-2">Valence</th>
                        <th className="px-4 border border-c_4 py-2">Volume</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-black dark:bg-opacity-25 dark:text-white divide-y divide-gray-200">
                {paginatedData.map(item => (
                    <tr key={item.id} className="bg-gray-100">
                        <td className="border border-c_4 px-4 py-2">{item.id}</td>
                        <td className="border border-c_4 px-4 py-2">{item.userEmail}</td>
                        <td className="border border-c_4 px-4 py-2">{item.Session_for}</td>
                        <td className="border border-c_4 px-4 py-2">{item.SessionStartedAt}</td>
                        <td className="border border-c_4 px-4 py-2">{item.CaptureTime}</td>
                        <td className="border border-c_4 px-4 py-2">{item.SessionEndedAt}</td>
                        <td className="border border-c_4 px-4 py-2">{item.arousal}</td>
                        <td className="border border-c_4 px-4 py-2">{item.attention}</td>
                        <td className="border border-c_4 px-4 py-2">{item.dominantEmotion}</td>
                        <td className="border border-c_4 px-4 py-2">{item.valence}</td>
                        <td className="border border-c_4 px-4 py-2">{item.volume}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    <div className='flex justify-center items-center p-3 bottom-0 overflow-auto'>
        <div className="pagination flex flex-wrap dark:text-white justify-center  space-x-2 space-y-2 ">
            {Array(totalPages).fill().map((_, idx) => (
            <button 
                key={idx} 
                onClick={() => handlePageChange(idx + 1)}
                className={`px-3 py-1 border border-c_4 hover:bg-opacity-30 hover:bg-c_5 hover:text-white rounded-md ${currentPage === idx+1 ? 'bg-c_4 text-white' : ''}`}
                >
                {idx + 1}
            </button>
            ))}
        </div>
    </div>
    </div>
);
};

export default DataTable;