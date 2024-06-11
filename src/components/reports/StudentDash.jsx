/* eslint-disable react/prop-types */

import PersonalReport from "./PersonalReport"

const MainDash = () => {

    return (
        <div className="flex flex-wrap overflow-auto gap-5 h-[90dvh] justify-around">
            <div className=" basis-[100%] overflow-x-auto p-4 dark:text-white dark:bg-black bg-c_4 bg-opacity-25 dark:bg-opacity-15 rounded shadow">
                <h2 className="text-xl font-bold mb-2">Personal Report</h2>
                <PersonalReport />
            </div>
        </div>
    )
}

export default MainDash;