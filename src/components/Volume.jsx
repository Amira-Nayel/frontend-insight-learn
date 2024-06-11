/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";

const VolumeComponent = (props) => {
  const [volume, setVolume] = useState(0);
  const volumeData = useRef([]); // Ref to store volume data
  const intervalId = useRef(null); // Ref to store interval id for clearing

  useEffect(() => {
    // Function to calculate average volume and update state
    const updateVolumeAverage = () => {
      const sum = volumeData.current.reduce((acc, val) => acc + val, 0);
      const average = sum / volumeData.current.length;
      setVolume(average);

      // Clear the volume data array
      volumeData.current = [];
    };
    // Set interval to update volume average every 5 seconds
    intervalId.current = setInterval(updateVolumeAverage, 5000);
    // Cleanup function to clear interval when component unmounts
    return () => {
      clearInterval(intervalId.current);
    };
  }, []);
  useEffect(() => {
    // Set volume in parent component whenever it changes
    props.setUserData(prevUserData => ({
      ...prevUserData,
      volume: volume
    }));
    props.setUserDataChanged(true);
  }, [volume]);

  useEffect(() => {
    // Function to set up audio context and listen for volume data
    const setupAudioContext = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Load the audio worklet processor from the public directory
        await audioContext.audioWorklet.addModule('/volume-processor.js');

        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const volumeNode = new AudioWorkletNode(audioContext, 'volume-processor');

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(volumeNode);
        volumeNode.connect(audioContext.destination);

        // Listen for volume data from the audio worklet
        volumeNode.port.onmessage = (event) => {
          volumeData.current.push(event.data.volume);
        };
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };
    // Call the setup function
    setupAudioContext();
  }, []);
  return (
    <div>
    </div>
  );
};

export default VolumeComponent;
