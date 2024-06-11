import { useRef, useState } from "react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Titlebar } from '@/components/common'


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





  return (
    <React.Fragment>
      <Titlebar />

      <div className="container">
        {/* <video
          width={"100%"}
          height={450}
          ref={videoRef}
          autoPlay
          muted /> */}
        {/* <Button type="button" onClick={isStart ? handleStop : handleRecord}>{isStart ? "Stop" : "Start"} Record</Button> */}

        <Tabs defaultValue="remote" >
          <div className="w-full flex items-center justify-center">
            <TabsList className=" items-center">
              <TabsTrigger value="remote">Remote</TabsTrigger>
              <TabsTrigger value="share">Share Screen</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="remote">Make changes to your account here.</TabsContent>
          <TabsContent value="share">Change your password here.</TabsContent>
        </Tabs>


      </div>
    </React.Fragment >
  );
}


