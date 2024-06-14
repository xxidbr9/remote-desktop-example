package stun

import (
	"log"
	"net"

	"github.com/pion/stun"
)

// StartStunServer starts a STUN server on the specified address.
func StartStunServer() {
	addr := "0.0.0.0:3478"
	udpAddr, err := net.ResolveUDPAddr("udp", addr)
	if err != nil {
		log.Fatalf("Failed to resolve address: %v", err)
	}

	conn, err := net.ListenUDP("udp", udpAddr)
	if err != nil {
		log.Fatalf("Failed to listen on UDP: %v", err)
	}
	defer conn.Close()

	log.Printf("STUN server listening on %s", addr)

	for {
		handleStunRequest(conn)
	}
}

func handleStunRequest(conn *net.UDPConn) {
	message := make([]byte, 1500)
	n, srcAddr, err := conn.ReadFrom(message)
	if err != nil {
		log.Printf("Failed to read from UDP: %v", err)
		return
	}

	m := new(stun.Message)
	m.Raw = message[:n]
	if err := m.Decode(); err != nil {
		log.Printf("Failed to decode STUN message: %v", err)
		return
	}

	if m.Type.Class == stun.ClassRequest && m.Type.Method == stun.MethodBinding {
		response := stun.MustBuild(m,
			stun.BindingSuccess,
			stun.Fingerprint,
		)

		udpSrcAddr, ok := srcAddr.(*net.UDPAddr)
		if !ok {
			log.Printf("Failed to cast srcAddr to UDPAddr")
			return
		}

		xma := stun.XORMappedAddress{IP: udpSrcAddr.IP, Port: udpSrcAddr.Port}

		if err := xma.AddTo(response); err != nil {
			log.Printf("Failed to add XOR MAPPED ADDRESS to response, %v", err)
		}

		if _, err := conn.WriteTo(response.Raw, srcAddr); err != nil {
			log.Printf("Failed to send response: %v", err)
		}
	}
}
