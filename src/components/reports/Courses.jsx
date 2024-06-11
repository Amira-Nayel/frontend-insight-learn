import { useState, useEffect } from 'react';
import axios from 'axios';
import QuizReport from './QuizReports';
import GradePredictions from './GradePredictions';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://dj-render-ldb1.onrender.com/fetchcourse');
                const mappedData = response.data.map(course => ({
                    id: course.id,
                    name: course.Course,
                    semester: course.Semester
                }));
                setCourses(mappedData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    if (isLoading) {
        return <div>
            <img className="w-[20vw] animate-pulse" src="/images/logo.png" alt="" />
        </div>;
    }

    const semesters = [...new Set(courses.map(course => course.semester))];

    return (
        <div className="container mx-auto h-[90dvh] flex flex-col gap-5">
            {selectedCourse ? (
                    <>
                        <h1 className="text-2xl dark:text-white self-center font-bold mb-4">{selectedCourse}</h1>
                        <div className='flex flex-col justify-center gap-5 items-center'>
                            <div className='flex justify-center items-center gap-5'>
                                <button className='bg-c_4 dark:text-white text-white hover:text-black border-2 border-c_4 rounded-md hover:bg-opacity-15 hover:bg-black  transition-all duration-200 ease-in p-2 w-fit self-center' onClick={() => setSelectedType('Predictions')}>Predictions</button>
                                <button className='bg-c_4 dark:text-white text-white hover:text-black border-2 border-c_4 rounded-md hover:bg-opacity-15 hover:bg-black  transition-all duration-200 ease-in p-2 w-fit self-center' onClick={() => setSelectedType('quiz')}>Quiz Grades Report</button>
                            </div>
                            <button className='bg-c_4 dark:text-white text-white hover:text-black border-2 border-c_4 rounded-md hover:bg-opacity-15 hover:bg-black  transition-all duration-200 ease-in p-2 w-fit self-center' onClick={() => setSelectedCourse(null)}>Return to courses</button>                                
                        </div>
                        {selectedType === 'Predictions' && (
                            <>
                                <div className='h-[80vh] flex justify-center items-start overflow-auto'>
                                    <GradePredictions courseName={selectedCourse} />
                                </div>
                            </>
                        )} {selectedType === 'quiz' && (

                            <>
                                <QuizReport courseName={selectedCourse} />
                            </>
                        )}
                    </>
            ) : (
                <>
                    <div className='bg-c_5  dark:bg-black dark:bg-opacity-25 p-5 flex flex-col shadow-md'>
                        <h1 className="text-2xl dark:text-white self-center font-bold mb-4">Semesters</h1>
                        <div className="flex flex-wrap overflow-auto h-[35dvh] max-sm:h-[30dvh] justify-start">
                            {semesters.map((semester, index) => (
                                <div key={index} className="p-4 border rounded-lg hover:bg-black bg-white dark:hover:text-white transition-all duration-200 hover:bg-opacity-10  shadow-md m-2 cursor-pointer" onClick={() => setSelectedSemester(semester)}>
                                    <h2 className="text-lg font-semibold">{semester}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                    {selectedSemester && (
                        <div className='bg-c_5 dark:bg-black dark:bg-opacity-25 p-5 flex flex-col shadow-md'>
                            <h1 className="text-2xl dark:text-white self-center font-bold mb-4">Courses for {selectedSemester}</h1>
                            <div className="flex flex-wrap  overflow-auto h-[35dvh] max-sm:h-[20dvh] justify-start">
                                {courses.filter(course => course.semester === selectedSemester).map((course) => (
                                    <div key={course.id} className="p-4 border flex justify-center items-center rounded-lg hover:bg-black dark:hover:text-white bg-white transition-all duration-200 hover:bg-opacity-10  shadow-md m-2 cursor-pointer" onClick={() => setSelectedCourse(course.name)}>
                                        <h2 className="text-lg font-semibold">{course.name}</h2>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Courses;