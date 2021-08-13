package main

import (
	"crypto/sha1"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

func GetDB() (db *sql.DB, err error) {
	db, err = sql.Open("sqlite3", "./urldb.db")
	statement, _ := db.Prepare("CREATE TABLE IF NOT EXISTS urls (	ID TEXT PRIMARY KEY, longurl TEXT, shorturl TEXT)")
	statement.Exec()
	return
}

var urls = make(map[string]string)

type urlstct struct {
	ID       string
	LongURL  string `json:"longUrl"`
	ShortURL string `json:"shortUrl"`
}

func register(w http.ResponseWriter, req *http.Request) {
	db, _ := GetDB()
	var burl urlstct
	decoder := json.NewDecoder(req.Body)

	//var data myData
	err := decoder.Decode(&burl)
	if err != nil {
		panic(err)
	}
	//contents, _ := ioutil.ReadAll(req.Body)
	//fmt.Println(string(contents))
	h := sha1.Sum([]byte(burl.LongURL))
	key := fmt.Sprintf("%x", h[:5])
	urls[key] = string(burl.LongURL)
	burl.ID = key
	burl.LongURL = string(burl.LongURL)
	burl.ShortURL = "http://localhost:8080/redirect/" + key
	stmt, err := db.Prepare(`
		INSERT INTO urls(ID,longurl,shorturl)
		VALUES(?, ?,?)
	`)
	if err != nil {
		fmt.Println("Prepare query error")
		panic(err)
	}
	_, err = stmt.Exec(burl.ID, burl.LongURL, burl.ShortURL)
	if err != nil {
		fmt.Println("Execute query error")
		panic(err)
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, fmt.Sprintf("Redirect for given URL %q at:\n%s://%s/redirect/%s", burl.LongURL, "http", req.Host, key))
}
func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the HomePage!")
	fmt.Println("Endpoint Hit: homePage")
}
func redirect(w http.ResponseWriter, req *http.Request) {
	db, _ := GetDB()
	var myurl urlstct
	//params := mux.Vars(req)
	//var url MyUrl
	//bucket.Get(params["id"], &url)
	// http.Redirect(w, req, url.LongUrl, 301)
	//key := req.URL.Path[1:]
	//contents, _ := ioutil.ReadAll("id")
	//fmt.Println(key)
	if strings.ToLower(req.Method) != "get" {
		http.Error(w, "405 method not allowed", http.StatusMethodNotAllowed)
		return
	}
	redirectkey := strings.Join(strings.Split(req.URL.Path, "/")[2:], "/")
	//dest, ok := urls[redirectkey]
	//fmt.Println(dest)
	//fmt.Println(redirectkey)
	//if !ok {
	//	http.Error(w, "404 no url registered for key "+redirectkey, http.StatusNotFound)
	//	return
	//}
	//var result =  db.query("Product", where: "id = ", whereArgs: [id]);
	//var result,error:=db.query(`select longurl from urls where id=[redirectkey]`)
	//var myresutlt,error:=db.Where("id,?",redirectkey)
	stmt, _ := db.Prepare(" SELECT * FROM urls where id = ?")
	rows, _ := stmt.Query(redirectkey)
	//db.get(rows,redirectkey)
	for rows.Next() {
		err :=
			rows.Scan(&myurl.ID, &myurl.LongURL, &myurl.ShortURL)
		checkErr(err)
	}
	fmt.Println(myurl.LongURL)
	jsonB, errMarshal := json.Marshal(myurl)
	checkErr(errMarshal)
	//fmt.Fprintf(w, "%s", string(jsonB))
	fmt.Println(string(jsonB))
	//fmt.Println(myresutlt)
	//fmt.Fprintf(w,result)
	http.Redirect(w, req, myurl.LongURL, http.StatusSeeOther)
	//fmt.Fprintf(w, myurl.LongURL)
	//fmt.Fprintf(w, "redurect")
}
func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}
func getAll(w http.ResponseWriter, r *http.Request) {
	db, _ := GetDB()
	rows, err := db.Query("SELECT * FROM urls")
	checkErr(err)
	var myurls []urlstct
	for rows.Next() {
		var myurl urlstct
		err = rows.Scan(&myurl.ID, &myurl.LongURL, &myurl.ShortURL)
		checkErr(err)
		myurls = append(myurls, myurl)
	}
	jsonB, errMarshal := json.Marshal(myurls)
	checkErr(errMarshal)
	//w.Write(jsonB)
	fmt.Fprintf(w, "%s", jsonB)
}
func main() {
	//database, _ := sql.Open("sqlite3", "./nraboy.db")
	//statement, _ := database.Prepare("CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY, firstname TEXT, lastname TEXT)")
	//statement.Exec()
	//statement, _ = database.Prepare("INSERT INTO people (firstname, lastname) VALUES (?, ?)")
	//statement.Exec("tomic", "labboy")
	db, _ := GetDB()
	//statement, _ := db.Prepare("INSERT INTO urldb (longurl, shorturl) VALUES (?, ?)")
	//statement.Exec("tomic", "labboy")
	//statement.Exec()

	//statement, _ = db.Prepare("INSERT INTO people (firstname, lastname) VALUES (?, ?)")
	//statement.Exec("tomic", "labboy")
	rows, _ := db.Query("SELECT* FROM urls")
	var id string
	var shorturl string
	var longurl string
	for rows.Next() {
		rows.Scan(&id, &longurl, &shorturl)
		fmt.Println(id + " " + longurl + " " + shorturl)
	}

	mux := http.NewServeMux()
	//mux.HandleFunc("/redirect/", redirect)
	mux.HandleFunc("/redirect/", redirect)
	mux.HandleFunc("/register", register)

	mux.HandleFunc("/list", getAll)
	http.ListenAndServe(":8080", mux)

}
