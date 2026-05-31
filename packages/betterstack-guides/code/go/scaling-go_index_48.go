# Source: https://betterstack.com/community/guides/scaling-go/index/
# Original language: go
# Normalized: go
# Block index: 48

[label main.go]
. . .
func main()
	. . .

[highlight]
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			w.Write([]byte("OK"))
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
[/highlight]

	fmt.Println("Server started on port 8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}