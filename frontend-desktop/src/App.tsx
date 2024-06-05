import { useRef, useState } from "react";
import "./App.css";


const displayMediaOptions = {
  video: {
    chromeMediaSource: { exact: 'monitor' },
  },
  audio: false,
};

function App() {
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isStart, setIsStart] = useState(false);
  async function startCapture() {
    try {
      streamRef.current = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions as DisplayMediaStreamOptions);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
    console.log({ ref: streamRef });
    return streamRef.current;
  }

  const handleRecord = async () => {
    if (!videoRef.current) return
    videoRef.current.srcObject = await startCapture();
    setIsStart(true)
  }

  const handleStop = () =>{
    if (!videoRef.current || !streamRef.current) return;

    // Stop all tracks
    streamRef.current.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null
    setIsStart(false)
  }

  return (
    <div className="container">
      <video
        width={"100%"}
        height={450}
        ref={videoRef}
        autoPlay
        muted />
      <button type="button" style={{ marginTop: "20px" }} onClick={isStart ? handleStop : handleRecord}>{isStart ? "Stop" : "Start"} Record</button>
    </div>
  );
}

export default App;
