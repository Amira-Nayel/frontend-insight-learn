/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

const EmotionBarsComponent = ({ setUserData }) => {
  const timeout = useRef(undefined);

  useEffect(() => {
    function resetTimeout() {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setUserData((prevUserData) => ({
          ...prevUserData,
          dominantEmotion: "Neutral",
        }));
      }, 3000);
    }

    function handleEmotionEvent(evt) {
      resetTimeout();
      const emotions = evt.detail.output.emotion;
      const dominantEmotion = getDominantEmotion(emotions);
      setUserData((prevUserData) => ({
        ...prevUserData,
        dominantEmotion,
      }));
    }

    function getDominantEmotion(emotions) {
      return Object.keys(emotions).reduce((a, b) => (emotions[a] > emotions[b] ? a : b));
    }

    window.addEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);

    return () => {
      clearTimeout(timeout.current);
      window.removeEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
    };
  }, [setUserData]);

  return null; // No visualizations needed
};

export default EmotionBarsComponent;
