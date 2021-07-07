package main

import (
    "fmt"
	"log"
	"net/http"
)

func eventCreation(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Method)
	switch r.Method {
	case "GET":
		http.ServeFile(w, r, "./frontend/static/index.html")
	case "POST":
		// Call ParseForm() to parse the raw query and update r.PostForm and r.Form.
		if err := r.ParseForm(); err != nil {
			fmt.Fprintf(w, "ParseForm() err: %v", err)
			return
		}
		fmt.Fprintf(w, "Post from website! r.PostFrom = %v\n", r.PostForm)
		fmt.Fprintf(w, "First Name = %s\n", r.FormValue("firstname"))
		fmt.Fprintf(w, "Last Name = %s\n", r.FormValue("lastname"))
		fmt.Fprintf(w, "Max Attendees = %s\n", r.FormValue("max-attendees"))
		fmt.Fprintf(w, "Start Datetime = %s\n", r.FormValue("start-time"))
		fmt.Fprintf(w, "End Datetime = %s\n", r.FormValue("end-time"))
	default:
		fmt.Fprintf(w, "Sorry, only GET and POST methods are supported.")
	}
}

func main() {
	//http.Handle("/", http.FileServer(http.Dir("./frontend/static")))
	http.HandleFunc("/", eventCreation)
	log.Panic(http.ListenAndServe(":8080", nil))
}
