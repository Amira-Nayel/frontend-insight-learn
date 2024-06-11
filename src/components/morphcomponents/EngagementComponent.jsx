/* eslint-disable react/prop-types */
import { useEffect } from "react";


const EngagementComponent = (props) => {

  useEffect(() => {
    
  
    function bindEvent(){
        window.addEventListener(
            "CY_FACE_AROUSAL_VALENCE_RESULT",
            handleArousalValenceEvents
          );
        window.addEventListener("CY_FACE_ATTENTION_RESULT", handleAttentionEvents);
    }
    
    function handleArousalValenceEvents (evt) {
      // set userData from props to save dominantEmotion 
      props.setUserData(prevUserData => ({
        ...prevUserData,
        valence: Math.round(evt.detail.output.valence * 100) || 0
      }));
      props.setUserDataChanged(true)
      // set userData from props to save dominantEmotion 
      props.setUserData(prevUserData => ({
        ...prevUserData,
        arousal: Math.round(evt.detail.output.arousal * 100) || 0
      }));
      props.setUserDataChanged(true)
  }
  
  function handleAttentionEvents (evt) {
      if (evt.detail.output.attention > 0.1) {
          // set userData from props to save dominantEmotion 
          props.setUserData(prevUserData => ({
            ...prevUserData,
            attention: Math.round(evt.detail.output.attention * 100)
          }));
      }
  }
    
    bindEvent();
    
  }, []);


  return (
    <>
    </>
    
  );
};

export default EngagementComponent;
