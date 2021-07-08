// package main

// import (
// 	"fmt"
// 	"log"
// 	"net/http"
// 	// "github.com/gorilla/mux"
// )
// // func homePage1(w http.ResponseWriter, r *http.Request) {
// // 	fmt.Fprint(w, "GET Homepage Endpoint Hit")
// // }

// // func homePage2(w http.ResponseWriter, r *http.Request) {
// // 	fmt.Fprint(w, "POST Homepage Endpoint Hit")
// // }

// // func handleRequests() {
// // 	myRouter := mux.NewRouter().StrictSlash(true)
// // 	myRouter.HandleFunc("/", homePage1).Methods("GET")
// // 	myRouter.HandleFunc("/", homePage2).Methods("POST")
// // 	log.Fatal(http.ListenAndServe(":8080", myRouter))
// // }

// // func main () {
// // 	handleRequests()
// // }

package main

import (
    "fmt"
    "html/template"
    "log"
    "net/http"
)

func login(w http.ResponseWriter, r *http.Request) {
    fmt.Println("method:", r.Method) //get request method
    if r.Method == "GET" {
        t, _ := template.ParseFiles("../../frontend/templates/eventcreation.html")
        t.Execute(w, nil)
    } else {
        r.ParseForm()
        // logic part of log in
		fmt.Fprintf(w, "Post from website! r.PostFrom = %v\n", r.PostForm)
		fmt.Fprintf(w, "First Name = %s\n", r.FormValue("firstname"))
		fmt.Fprintf(w, "Last Name = %s\n", r.FormValue("lastname"))
		fmt.Fprintf(w, "Max Attendees = %s\n", r.FormValue("max-attendees"))
		fmt.Fprintf(w, "Start Datetime = %s\n", r.FormValue("start-time"))
		fmt.Fprintf(w, "End Datetime = %s\n", r.FormValue("end-time"))
    }
}

func main() {
	fmt.Println("Starting server...")
	http.Handle("/", http.FileServer(http.Dir("../../frontend")))
    http.HandleFunc("/login", login)
    log.Fatal(http.ListenAndServe( ":8080", nil ))
}
