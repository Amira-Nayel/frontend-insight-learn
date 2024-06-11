/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);
const GradePredictions = ({courseName}) => {
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('email');
    const [filterType, setFilterType] = useState('contains');
    const [gradeFilter, setGradeFilter] = useState('');
    useEffect(() => {
        fetch('https://dj-render-ldb1.onrender.com/gradeprediction')
            .then((response) => response.json())
            .then((data) => {
                setPredictions(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [courseName]);
    const filteredPredictions = predictions.filter(prediction => {
        if (gradeFilter) {
            return prediction.Course === courseName && prediction.predictions === gradeFilter;
        } else {
            return prediction.Course === courseName;
        }
    });
    const searchResults = filteredPredictions.filter(user => {
        if (filterBy === 'email') {
            if (filterType === 'contains') {
                return user.email.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (filterType === 'startsWith') {
                return user.email.toLowerCase().startsWith(searchTerm.toLowerCase());
            } else if (filterType === 'endsWith') {
                return user.email.toLowerCase().endsWith(searchTerm.toLowerCase());
            }
        } 
    });
    const gradeCounts = searchResults.reduce((counts, { predictions }) => {
        counts[predictions] = (counts[predictions] || 0) + 1;
        return counts;
    }, {});
    const chartData = {
        labels: ['A', 'B', 'C', 'D', 'F'],
        datasets: [
            {
                data: [gradeCounts['A'] || 0,gradeCounts['B'] || 0,gradeCounts['C'] || 0,
                    gradeCounts['D'] || 0,gradeCounts['F'] || 0,
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',  // 10 to 15
                    'rgba(75, 192, 192, 0.2)',  // 20 to 25
                    'rgba(255, 206, 86, 0.2)',  // 15 to 20
                    'rgba(153, 102, 255, 0.2)', // 25 to 30
                    'rgba(255, 99, 132, 0.2)',  // Less than 10
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',    // 10 to 15
                    'rgba(75, 192, 192, 1)',    // 20 to 25
                    'rgba(255, 206, 86, 1)',    // 15 to 20
                    'rgba(153, 102, 255, 1)',   // 25 to 30 
                    'rgba(255, 99, 132, 1)',    // Less than 10
                ],
                borderWidth: 1,
            },
        ],
    };
    if (isLoading) {
        return <div className='bg-c_3 dark:bg-dark-grey justify-center items-center rounded-lg flex p-5'>
            <img className="w-[20vw] animate-pulse" src="/images/logo.png" alt="" />
        </div>;
    }
    return (
        <div className='flex flex-col justify-center items-center gap-5'>
            <div className='w-[300px] bg-c_4 bg-opacity-25 dark:bg-black dark:bg-opacity-25 p-5'>
                <Pie data={chartData} />
            </div>
            <div className='flex flex-wrap justify-center items-center gap-3'>
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={event => setSearchTerm(event.target.value)}
                    className="p-2 mb-4 dark:bg-black dark:bg-opacity-25 dark:text-white border border-c_4  rounded-md"
                />
                <select 
                    value={filterBy} 
                    onChange={e => setFilterBy(e.target.value)} 
                    className="p-2 mb-4 border border-c_4 dark:bg-black dark:text-white dark:bg-opacity-25  rounded-md"
                >
                    <option value="email">Email</option>
                </select>
                <select
                    value={filterType}
                    onChange={event => setFilterType(event.target.value)}
                    className="p-2 mb-4 border border-c_4 dark:bg-black dark:text-white dark:bg-opacity-25  rounded-md"
                >
                    <option value="contains">Contains</option>
                    <option value="startsWith">Starts with</option>
                    <option value="endsWith">Ends with</option>
                </select>
                <select 
                    value={gradeFilter} 
                    onChange={e => setGradeFilter(e.target.value)} 
                    className="p-2 mb-4 border border-c_4 dark:bg-black dark:text-white dark:bg-opacity-25  rounded-md"
                >
                    <option value="">All</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                </select>
            </div>
            <div className="shadow h-[40dvh] dark:bg-black dark:bg-opacity-25 dark:text-white w-[80vw] overflow-scroll l border-b border-gray-200 ">
                <table className="min-w-full divide-y divide-c_4 ">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-c_4 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-c_4 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-c_4 uppercase tracking-wider">Predictions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.map((prediction, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 border border-c_4 whitespace-nowrap">{prediction.email}</td>
                                <td className="px-6 py-4 border border-c_4 whitespace-nowrap">{prediction.Course}</td>
                                <td className="px-6 py-4 border border-c_4 whitespace-nowrap">{prediction.predictions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        
    )
}

export default GradePredictions