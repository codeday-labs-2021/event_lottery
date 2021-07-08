package main

import (
    "fmt"
    "net/http"
    "log"
)

func home(w http.ResponseWriter, r *http.Request) {
    fmt.Println("Home Request:", r.Method)
    switch r.Method {
    case "GET":
        http.ServeFile(w, r, "../../frontend/templates/home.html")
    default:
        fmt.Println("ONLY GET and POST")
    }
}

func create(w http.ResponseWriter, r *http.Request) {
    fmt.Println("Create Request:", r.Method)
    switch r.Method {
    case "GET":
        http.ServeFile(w, r, "../../frontend/templates/eventcreate.html")
    case "POST":
        fmt.Println("First Name = ", r.FormValue("firstname"))
        fmt.Println("Last Name = ", r.FormValue("lastname"))
        fmt.Println("Max Attendees = ", r.FormValue("max-attendees"))
        fmt.Println("Start Datetime = ", r.FormValue("start-time"))
		fmt.Println("End Datetime =", r.FormValue("end-time"))
        http.ServeFile(w, r, "home.html")
    default:
        fmt.Println("ONLY GET and POST")
    }
}

func register(w http.ResponseWriter, r *http.Request) {
    fmt.Println("Register Request", r.Method)
}

func events(w http.ResponseWriter, r *http.Request) {
    fmt.Println("Events Request", r.Method)
}

func main () {
    http.HandleFunc("/", home)
    http.HandleFunc("/create/", create)
    http.HandleFunc("/register/", register)
    http.HandleFunc("/events/", events)
    fmt.Println("Starting server...")
    log.Fatal(http.ListenAndServe(":8080", nil))
}