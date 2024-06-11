import { useRef, useState } from "react";
import React from "react";
import { Button, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, Tabs, TabsContent, TabsList, TabsTrigger, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { Titlebar } from '@/components/common'
import { invoke } from "@tauri-apps/api/core";
import { readText, writeText } from '@tauri-apps/plugin-clipboard-manager';
import { Clipboard, ClipboardText } from "@phosphor-icons/react";

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

      <div className="container h-[324px]" >
        {/* <video
          width={"100%"}
          height={450}
          ref={videoRef}
          autoPlay
          muted /> */}
        {/* <Button type="button" onClick={isStart ? handleStop : handleRecord}>{isStart ? "Stop" : "Start"} Record</Button> */}

        <Tabs defaultValue="remote" className="h-full">
          <div className="w-full flex items-center justify-center pb-20">
            <TabsList className=" items-center">
              <TabsTrigger value="remote">Remote</TabsTrigger>
              <TabsTrigger value="share">Share Screen</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="remote">
            <RemoteContainer />
          </TabsContent>
          <TabsContent value="share">
            <ShareScreenArea />
          </TabsContent>
        </Tabs>


      </div>
    </React.Fragment >
  );
}


const RemoteContainer = () => {

  const [code, setCode] = useState("")

  const handleOpenRemote = async () => {
    invoke("create_window", { url: `/remote/${code}` })
  }
  const handlePaste = async () => {
    const text = await readText()
    setCode(text)
  }
  return (
    <div className="flex flex-col gap-y-4 h-full justify-between">
      <div className="w-full flex flex-col items-center justify-center gap-y-5">

        <div className="flex items-center flex-col gap-y-2">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Tooltip>
            <TooltipTrigger asChild >
              <Button onClick={handlePaste} variant={"secondary"} size={"icon"} >
                <ClipboardText size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent data-side="bottom">
              <p>Paste to box</p>
            </TooltipContent>
          </Tooltip>

        </div>
        <div className="flex flex-col gap-y-2 text-center">
          <span className="text-xs text-foreground ">Copy other code and paste for remote other pc.</span>
        </div>
      </div>
      <Button onClick={handleOpenRemote} disabled={!code}>
        Remote Now
      </Button>
    </div>
  )
};

const ShareScreenArea = () => {
  const value = "333333"

  const handleCopy = () => {
    writeText(value);
  }
  return (
    <div className="flex flex-col gap-y-4 h-full justify-between">
      <div className="w-full flex flex-col items-center justify-center gap-y-16">

        <InputOTP maxLength={6} value={value} disabled>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <div className="flex flex-col gap-y-2 text-center">
          <span className="text-xs text-foreground ">Copy this code and share to someone you trust!!</span>
        </div>
      </div>
      <Button onClick={handleCopy} className="">
        Copy code
      </Button>
    </div>
  )
}

