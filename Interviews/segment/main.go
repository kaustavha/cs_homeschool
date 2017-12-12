package main

func main() {
	NewProxy("", 1, 10, ":8080")
	NewRESPProxy("127.0.0.1:6379", 1, 10, ":8081", 10)
}
