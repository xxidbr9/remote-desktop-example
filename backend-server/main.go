package main

import (
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/xxidbr9/remote-desktop-example/backend-server/stun"
	internal_ws "github.com/xxidbr9/remote-desktop-example/backend-server/ws"
)

func main() {
	go stun.StartStunServer()

	app := fiber.New()

	app.Get("/ws", websocket.New(internal_ws.HandleWebSocket))

	log.Println("Web server started on :8080")
	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
