/* eslint-disable react/prop-types */

const Session = (props) => {
    return (
        <div className="bg-white ">
            <div className="flex flex-col relative items-center justify-center gap-10 py-10 p-7">
                <h1 className="text-3xl">Dear  { props.username}</h1>
                <div className="flex max-sm:flex-col gap-10 justify-center items-center">
                    <div className="flex basis-1/2">
                        <img className="w-auto" src="images/session.png" alt="" />
                    </div>
                    <div className="flex bg-c_5 gap-10 basis-1/2 py-20 px-5 flex-col justify-center items-center">
                            {!props.sessionStarted ?
                                <span className=" text-center font-bold text-xl">
                                    <h2>Start Your Session And Navigate</h2>
                                    <h2>To Moodle</h2>
                                </span>
                                : <span className=" text-center font-bold text-xl">
                                    <h2>Click the button below to End your session.</h2>
                                </span>
                            }
                            
                        
                        {!props.sessionStarted && <p className="text-center">Click the button below to start your session</p>}
                        {props.sessionStarted && <p className="text-center">You are now redirected to Moodle</p>}
                        {props.sessionStarted ? <button onClick={props.handleSessionEnd} className="bg-black text-white border-2 hover:bg-c_5 hover:text-black transition-all duration-200 ease-in px-3 py-1 rounded-3xl" >End Session</button>
                        : <button onClick={props.handleSessionStart} className="bg-transparent text-black border-2 hover:bg-black hover:text-white transition-all duration-200 ease-in px-3 py-1 rounded-3xl" >Start Session</button>    
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Session
