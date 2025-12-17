import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export const useEmotion = () => {
  const [emotion, setEmotion] = useState('neutral');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("1. Loading Models...");
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        console.log("2. Models Loaded ✅");
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            console.log("UI Ready ✅");
            setLoading(false);
          };
        }
      } catch (err) {
        setError(err.message);
      }
    };
    init();
  }, []);

  const detect = async () => {
    if (videoRef.current && !loading && videoRef.current.readyState === 4) {
      // InputSize increased to 224 for better feature extraction (helps with 'Fearful')
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }) 
      ).withFaceExpressions();

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        
        let top;
        // PRIORITY LOGIC: Boost subtle emotions that often get hidden by Neutral
        if (expressions.fearful > 0.25) {
          top = 'fearful';
        } else if (expressions.angry > 0.25) {
          top = 'angry';
        } else {
          // Standard logic for Happy, Sad, Surprised, Neutral
          top = Object.keys(expressions).reduce((a, b) => 
            expressions[a] > expressions[b] ? a : b
          );
        }
        
        setEmotion(top);
      }
    }
  };

  return { videoRef, emotion, loading, error, detect };
};