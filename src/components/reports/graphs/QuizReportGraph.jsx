import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

const QuizReportGraph = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [gradeRange, setGradeRange] = useState('');
    const [course, setCourse] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('https://dj-render-ldb1.onrender.com/fetchquiz') // Replace with your API URL
        .then(response => response.json())
        .then(data => {
            const mappedData = data
                    .filter(student => student.sumgrades !== null)
                    .map(student => ({
                        ...student,
                        sumgrades: parseFloat(student.sumgrades)
                    }));
            setQuizzes(mappedData);
            setCourse(data[0].Course);
            setIsLoading(false);
        })
        .catch(error => console.error('Error:', error));
    }, []);
    
    const courseNames = [...new Set(quizzes.map(quiz => quiz.Course))];
    const filteredQuizzes = quizzes.filter(quiz => quiz.Course === course);

    const filteredGrades = filteredQuizzes.filter(quiz => {
        if (quiz.Course !== course) {
            return false;
        }

        switch (gradeRange) {
            case '0-10':
                return quiz.sumgrades < 10;
            case '10-15':
                return quiz.sumgrades >= 11 && quiz.sumgrades <= 15;
            case '15-20':
                return quiz.sumgrades >= 16 && quiz.sumgrades <= 20;
            case '20-25':
                return quiz.sumgrades >= 21 && quiz.sumgrades <= 25;
            case '25-30':
                return quiz.sumgrades >= 26 && quiz.sumgrades <= 30;
            case '30-35':
                return quiz.sumgrades >= 31 && quiz.sumgrades <= 35;
            case '35-40':
                return quiz.sumgrades >= 36 && quiz.sumgrades <= 40;
            default:
                return true;
        }
    });

    const gradeRanges = {
        'Less than 10': filteredGrades.filter(quiz => quiz.sumgrades < 10).length,
        '10 to 15': filteredGrades.filter(quiz => quiz.sumgrades >= 11 && quiz.sumgrades <= 15).length,
        '15 to 20': filteredGrades.filter(quiz => quiz.sumgrades >= 16 && quiz.sumgrades <= 20).length,
        '20 to 25': filteredGrades.filter(quiz => quiz.sumgrades >= 21 && quiz.sumgrades <= 25).length,
        '25 to 30': filteredGrades.filter(quiz => quiz.sumgrades >= 26 && quiz.sumgrades <= 30).length,
        '30 to 35': filteredGrades.filter(quiz => quiz.sumgrades >= 31 && quiz.sumgrades <= 35).length,
        '35 to 40': filteredGrades.filter(quiz => quiz.sumgrades >= 36 && quiz.sumgrades <= 40).length,
    };

    const chartData = {
        labels: Object.keys(gradeRanges),
        datasets: [
            {
                label: 'Students',
                data: Object.values(gradeRanges),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',  // Less than 10
                    'rgba(54, 162, 235, 0.2)',  // 10 to 15
                    'rgba(255, 206, 86, 0.2)',  // 15 to 20
                    'rgba(75, 192, 192, 0.2)',  // 20 to 25
                    'rgba(153, 102, 255, 0.2)', // 25 to 30
                    'rgba(255, 159, 64, 0.2)',  // 30 to 35
                    'rgba(0, 240, 0, 0.2)'  // 35 to 40
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',    // Less than 10
                    'rgba(54, 162, 235, 1)',    // 10 to 15
                    'rgba(255, 206, 86, 1)',    // 15 to 20
                    'rgba(75, 192, 192, 1)',    // 20 to 25
                    'rgba(153, 102, 255, 1)',   // 25 to 30
                    'rgba(255, 159, 64, 1)',    // 30 to 35
                    'rgba(0, 199, 199, 1)'    // 35 to 40
                ],
                borderWidth: 1,
            },
        ],
    };

    const sortedQuizzes = [...filteredQuizzes].sort((a, b) => b.sumgrades - a.sumgrades);
   // Check if sortedQuizzes is not null and has at least one element before accessing the first element
    const maxGrade = sortedQuizzes && sortedQuizzes.length > 0 ? sortedQuizzes[0].sumgrades : 0;

    // Check if sortedQuizzes is not null before calling filter
    const fullMarkQuizzes = sortedQuizzes ? sortedQuizzes.filter(quiz => quiz.sumgrades === maxGrade) : [];
        

    if (isLoading) {
        return <div className='bg-c_3 dark:bg-dark-grey justify-center items-center rounded-lg flex p-5'>
            <img className="w-[20vw] animate-pulse" src="/images/logo.png" alt="" />
        </div>;
    }

    return (
        <div className='flex flex-wrap justify-start items-start'>
            <div className="flex flex-col">
                <div className='flex flex-col justify-start items-start overflow-x-scroll'>
                    <div className='max-sm:h-fit sm:h-fit min-w-[300px]'>
                        <Pie data={chartData} />
                    </div>
                </div>
                <div className='flex flex-wrap gap-1 justify-center items-center self-center'>
                    <select 
                        value={course} 
                        onChange={e => setCourse(e.target.value)} 
                        className="mb-4 p-2 w-[100%] border-c_4 dark:bg-black dark:bg-opacity-25 dark:text-white border border-gray-300 rounded"
                    >
                        {courseNames.map((courseName, index) => (
                            <option className='dark:text-black ' key={index} value={courseName}>{courseName}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='flex flex-col justify-start items-start h-[40vh] overflow-auto'>
                <h1>Students With Full Mark: {fullMarkQuizzes.length}</h1>
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 border border-c_4 py-2">Username</th>
                            <th className="px-4 border border-c_4 py-2">Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                            {fullMarkQuizzes.map((quiz, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                                    <td className="border border-c_4 px-4 py-2">{quiz.username}</td>
                                    <td className="border border-c_4 px-4 py-2">{quiz.sumgrades}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default QuizReportGraph