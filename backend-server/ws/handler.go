package internal_ws

import (
	"encoding/json"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/pion/webrtc/v3"
)

// HandleWebSocket handles incoming WebSocket connections.
func HandleWebSocket(c *websocket.Conn) {
	peerConnection, err := webrtc.NewPeerConnection(webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{URLs: []string{"stun:your.server.ip:3478"}},
		},
	})
	if err != nil {
		log.Fatalf("Failed to create peer connection: %v", err)
	}

	peerConnection.OnICECandidate(func(candidate *webrtc.ICECandidate) {
		if candidate == nil {
			return
		}
		candidateJSON, err := json.Marshal(candidate.ToJSON())
		if err != nil {
			log.Printf("Error marshaling candidate: %v", err)
			return
		}
		if err := c.WriteMessage(websocket.TextMessage, candidateJSON); err != nil {
			log.Printf("Error sending candidate: %v", err)
		}
	})

	peerConnection.OnTrack(func(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
		log.Println("New track received:", track.ID())
	})

	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Printf("Read error: %v", err)
			break
		}

		var msg map[string]interface{}
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("Unmarshal error: %v", err)
			continue
		}

		switch msg["type"] {
		case "offer":
			handleOffer(peerConnection, message, c)
		case "candidate":
			handleCandidate(peerConnection, message)
		}
	}
}

func handleOffer(peerConnection *webrtc.PeerConnection, message []byte, c *websocket.Conn) {
	offer := webrtc.SessionDescription{}
	if err := json.Unmarshal(message, &offer); err != nil {
		log.Printf("Error unmarshal offer: %v", err)
		return
	}
	if err := peerConnection.SetRemoteDescription(offer); err != nil {
		log.Printf("Error setting remote description: %v", err)
		return
	}
	answer, err := peerConnection.CreateAnswer(nil)
	if err != nil {
		log.Printf("Error creating answer: %v", err)
		return
	}
	if err := peerConnection.SetLocalDescription(answer); err != nil {
		log.Printf("Error setting local description: %v", err)
		return
	}
	answerJSON, err := json.Marshal(answer)
	if err != nil {
		log.Printf("Error marshaling answer: %v", err)
		return
	}
	if err := c.WriteMessage(websocket.TextMessage, answerJSON); err != nil {
		log.Printf("Error sending answer: %v", err)
	}
}

func handleCandidate(peerConnection *webrtc.PeerConnection, message []byte) {
	candidate := webrtc.ICECandidateInit{}
	if err := json.Unmarshal(message, &candidate); err != nil {
		log.Printf("Error unmarshal candidate: %v", err)
		return
	}
	if err := peerConnection.AddICECandidate(candidate); err != nil {
		log.Printf("Error adding ICE candidate: %v", err)
	}
}
