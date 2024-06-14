const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let localStream;
let remoteStream;
let peerConnection;

const signalingServer = new WebSocket("ws://192.168.0.101:8080/ws");

signalingServer.onmessage = async message => {
  const data = JSON.parse(message.data);

  switch (data.type) {
    case "offer":
      await handleOffer(data);
      break;
    case "answer":
      await handleAnswer(data);
      break;
    case "candidate":
      await handleCandidate(data);
      break;
  }
};

function sendSignalingMessage(message) {
  if (signalingServer && signalingServer.readyState === WebSocket.OPEN) {
    signalingServer.send(JSON.stringify(message));
  } else {
    console.error("WebSocket is not open. Unable to send message:", message);
  }
}

const servers = {
  iceServers: [
    { urls: "stun:192.168.0.101:3478" },
    // { urls: "stun:0.0.0.0:3478" } // Replace with your actual STUN server address if different
  ]
};

const displayMediaOptions = {
  video: {
    displaySurface: "browser"
  },
  audio: {
    suppressLocalAudioPlayback: false
  },
  preferCurrentTab: false,
  selfBrowserSurface: "exclude",
  systemAudio: "include",
  surfaceSwitching: "include",
  monitorTypeSurfaces: "include"
};

async function startCall() {
  // localStream = await navigator.mediaDevices.getUserMedia({
  //   video: false,
  //   audio: true
  // });
  localStream = await navigator.mediaDevices.getDisplayMedia(
    displayMediaOptions
  );
  localVideo.srcObject = localStream;

  peerConnection = new RTCPeerConnection(servers);

  localStream
    .getTracks()
    .forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      console.log({ candidate: event.candidate });
      sendSignalingMessage({ type: "candidate", candidate: event.candidate });
    }
  };

  peerConnection.ontrack = event => {
    if (!remoteStream) {
      remoteStream = new MediaStream();
      remoteVideo.srcObject = remoteStream;
    }
    remoteStream.addTrack(event.track);
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  // console.log({ offer });
  sendSignalingMessage({ type: "offer", offer: offer });
}

async function handleOffer(data) {
  peerConnection = new RTCPeerConnection(servers);

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      sendSignalingMessage({ type: "candidate", candidate: event.candidate });
    }
  };

  peerConnection.ontrack = event => {
    if (!remoteStream) {
      remoteStream = new MediaStream();
      remoteVideo.srcObject = remoteStream;
    }
    remoteStream.addTrack(event.track);
  };

  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  sendSignalingMessage({ type: "answer", answer: answer });
}

async function handleAnswer(answer) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

async function handleCandidate(data) {
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  } catch (e) {
    console.error("Error adding received ICE candidate", e);
  }
}

startCall();
