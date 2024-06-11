import { useState, useEffect } from 'react';

const PersonalPredictionChecker = () => {
    const email = localStorage.getItem('email');
    const [course, setCourse] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch the predictions data from the API
        fetch('https://dj-render-ldb1.onrender.com/successprediction')
            .then((response) => response.json())
            .then((data) => {
                setPredictions(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    const handleCourseChange = (e) => {
        setCourse(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const prediction = predictions.find(pred => pred.email === email && pred.Course === course);
        if (prediction) {
            setResult(prediction.predictions === 1 ? 
                'You Are predicted to pass in this course, Keep Going.' 
                : 
                'You Are predicted to fail in this course, Study Harder.'
            );
        } else {
            setResult('No prediction available for the given email and course.');
        }
    };
    const uniqueCourses = Array.from(new Set(predictions.map(pred => pred.Course)));


    if (isLoading) {
        return <div className='bg-c_3 dark:bg-dark-grey justify-center items-center rounded-lg flex p-5'>
            <img className="w-[20vw] animate-pulse" src="/images/logo.png" alt="" />
        </div>;
    }


    return (
        <div className="max-md:container flex flex-col border-2 border-c_4 gap-5 dark:text-white bg-c_5 dark:bg-black dark:bg-opacity-50 p-6  mx-auto mt-8">
            <h1 className="text-3xl font-semibold mb-4">Student Course Prediction Checker</h1>
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label htmlFor="course" className="text-lg font-medium">Course Name:</label>
                    <select id="course" value={course} onChange={handleCourseChange} className="border border-c_4 rounded-md px-3 py-2 dark:bg-black dark:bg-opacity-25 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value="">Select a course</option>
                        {uniqueCourses.map((courseName, index) => (
                            <option key={index} value={courseName}>{courseName}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className='bg-c_4 dark:text-white text-white hover:text-black border-2 border-c_4 rounded-md hover:bg-opacity-15 hover:bg-black  transition-all duration-200 ease-in p-2 w-fit self-center'>Get Predictions</button>
            </form>
            {result && (
                result === 'No prediction available for the given email and course.' ?
                <p className="text-2xl self-center w-fit">{result}</p> :
                result === 'You Are predicted to pass in this course, Keep Going.' ?
                <p className="text-2xl self-center p-3 w-fit border-2 border-[green] bg-[green] bg-opacity-10 hover:animate-pulse text-[green] transition-all duration-200 ease-linear">{result}</p> :
                <p className="text-2xl self-center p-3 w-fit border-2 border-[red] bg-[red] bg-opacity-5 hover:animate-pulse text-[red] transition-all duration-200 ease-linear">{result}</p>
            )}
        </div>
    );
};

export default PersonalPredictionChecker;
