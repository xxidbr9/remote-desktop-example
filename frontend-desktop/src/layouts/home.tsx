import { useRef, useState } from "react";
import React from "react";
import { Window } from '@tauri-apps/api/window';
import { Cards, X, Minus } from "@phosphor-icons/react";

const appWindow = new Window('main');

const displayMediaOptions = {
  video: {
    chromeMediaSource: { exact: 'monitor' },
  },
  audio: false,
};

export function HomeLayout() {
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

  const handleStop = () => {
    if (!videoRef.current || !streamRef.current) return;

    // Stop all tracks
    streamRef.current.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null
    setIsStart(false)
  }

  const handleMin = () => {
    appWindow.minimize()
  }
  const handleMax = () =>{
    appWindow.toggleMaximize()
  }
  const handleClose = () => {
    appWindow.close()
  }

  return (
    <React.Fragment>
      <div data-tauri-drag-region className="titlebar">
        <div className="titlebar-button" onClick={handleMin} id="titlebar-minimize">
          <Minus size={14} />
        </div>
        {/* <div data-tauri-maximize-button-region className="titlebar-button" onClick={handleMax} id="titlebar-maximize">
          <Cards size={14} />
        </div> */}
        <div className="titlebar-button btn-danger" onClick={handleClose} id="titlebar-close">
          <X size={14} />
        </div>
      </div>
      <div className="container">
        {/* <video
          width={"100%"}
          height={450}
          ref={videoRef}
          autoPlay
          muted /> */}
        <button type="button" style={{ marginTop: "20px" }} onClick={isStart ? handleStop : handleRecord}>{isStart ? "Stop" : "Start"} Record</button>
      </div>
    </React.Fragment>
  );
}


