package main

import (
	"crypto/sha1"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"reflect"
	"strings"
	"time"

	"github.com/rs/cors"

	_ "github.com/mattn/go-sqlite3"
)

func GetDB() (db *sql.DB, err error) {
	db, err = sql.Open("sqlite3", "./urldb.db?_foreign_keys=on")
	if err != nil {
		// Print error and exit if there was problem opening connection.
		log.Fatal(err)
	}
	//defer db.Close()
	//statement, _ := db.Prepare("CREATE TABLE IF NOT EXISTS urls (	ID TEXT PRIMARY KEY, longurl TEXT, shorturl TEXT)")
	//statement.Exec()
	//defer db.Close()

	/*const (
		//CREATE = "CREATE TABLE times (id INTEGER, datetime INTEGER)" // TEXT
		START = "CREAT TABLE IF NOT EXISTS statistics (ID INTEGER PRIMARY KEY,iPaddress TEXT,timestamp INTEGER,useragent TEXT,FOREIGN KEY (urlid) REFERENCES urls(ID))"
	)
	db.Exec(START)*/
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS statistics (ID INTEGER PRIMARY KEY,iPaddress TEXT,timestamp INTEGER,useragent TEXT,urlid TEXT,FOREIGN KEY (urlid) REFERENCES urls(ID))")
	if err != nil {
		panic(err.Error())
	}

	//statements, _ := db.Prepare("CREAT TABLE IF NOT EXISTS statistics (ID INTEGER PRIMARY KEY,iPaddress TEXT,timestamp INTEGER,useragent TEXT,FOREIGN KEY (urlid) REFERENCES urls(ID))")
	//statements.Exec()

	return
}

var urls = make(map[string]string)

type count struct {
	Price int `json:",count"`
}
type urlstct struct {
	ID       string
	LongURL  string `json:"longUrl"`
	ShortURL string `json:"shortUrl"`
}
type stats struct {
	ID        int
	IpAddress string
	UserAgent string
	TimeStamp int64
	urlid     string
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
	jsonB, errMarshal := json.Marshal(burl.ShortURL)
	checkErr(errMarshal)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonB)
	//fmt.Fprintf(w, fmt.Sprintf("Redirect for given URL %q at:\n%s://%s/redirect/%s", burl.LongURL, "http", req.Host, key))
}
func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the HomePage!")
	fmt.Println("Endpoint Hit: homePage")
}
func redirect(w http.ResponseWriter, req *http.Request) {
	db, _ := GetDB()
	var myurl urlstct
	// http.Redirect(w, req, url.LongUrl, 301)
	//key := req.URL.Path[1:]
	//contents, _ := ioutil.ReadAll("id")
	var reqstat stats
	if strings.ToLower(req.Method) != "get" {
		http.Error(w, "405 method not allowed", http.StatusMethodNotAllowed)
		return
	}
	redirectkey := strings.Join(strings.Split(req.URL.Path, "/")[2:], "/")

	//if !ok {
	//	http.Error(w, "404 no url registered for key "+redirectkey, http.StatusNotFound)
	//	return
	//}
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

	http.Redirect(w, req, myurl.LongURL, http.StatusSeeOther)
	//fmt.Fprintf(w, myurl.LongURL)
	/*for k, v := range req.Header {
		fmt.Print(k)
		fmt.Print(" : ")
		fmt.Println(v)
	}*/

	//ua := req.Header.Get("User-Agent")
	//fmt.Println(ua)
	time := time.Now().UnixNano() / int64(time.Millisecond)
	fmt.Println(reflect.TypeOf(time))
	fmt.Println(time)
	//ips := getClientIP(req)

	//fmt.Print(ips)
	//fmt.Println(ips)
	//w.Write(ips)
	ip := ReadUserIP(req)
	fmt.Println(ip)
	userAgent := req.UserAgent()
	fmt.Printf("UserAgent:: %s", userAgent)
	reqstat.IpAddress = ip
	reqstat.TimeStamp = time
	reqstat.UserAgent = userAgent
	reqstat.urlid = redirectkey
	stmt, err := db.Prepare(`
		INSERT INTO statistics(ipaddress,timestamp,useragent,urlid)
		VALUES(?, ?,?,?)
	`)
	if err != nil {
		fmt.Println("Prepare query error")
		panic(err)
	}
	_, err = stmt.Exec(reqstat.IpAddress, reqstat.TimeStamp, reqstat.UserAgent, reqstat.urlid)
	if err != nil {
		fmt.Println("Execute query error")
		panic(err)
	}

}
func ReadUserIP(r *http.Request) string {
	IPAddress := r.Header.Get("X-Real-Ip")
	if IPAddress == "" {
		IPAddress = r.Header.Get("X-Forwarded-For")
	}
	if IPAddress == "" {
		IPAddress = r.RemoteAddr
	}
	return IPAddress
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func GetIP(req *http.Request) string {
	for _, h := range []string{"X-Forwarded-For", "X-Real-Ip"} {
		addresses := strings.Split(req.Header.Get(h), ",")
		// march from right to left until we get a public address
		// that will be the address right before our proxy.
		for i := len(addresses) - 1; i >= 0; i-- {
			ip := strings.TrimSpace(addresses[i])
			// header can contain spaces too, strip those out.
			realIP := net.ParseIP(ip)
			if !realIP.IsGlobalUnicast() {
				// bad address, go to next
				continue
			}
			return ip
		}
	}
	return ""
}

func ExampleHandler(w http.ResponseWriter, r *http.Request) {

	ip := GetIP(r)

	w.WriteHeader(200)
	fmt.Println(ip)
	w.Write([]byte(ip))
	userAgent := r.UserAgent()
	fmt.Printf("UserAgent:: %s", userAgent)
	ua := r.Header.Get("User-Agent")
	fmt.Printf("user agent is: %s \n", ua)
	w.Write([]byte("user agent is " + ua))
}

func ussage(w http.ResponseWriter, r *http.Request) {
	db, _ := GetDB()
	//id, _ := ioutil.ReadAll("id")t
	//vars := mux.Vars(r)
	//id, _ := strconv.Atoi(vars["id"])
	id := strings.TrimPrefix(r.URL.Path, "/stats/")

	fmt.Println(id)
	var count int
	row := db.QueryRow("SELECT COUNT(*) FROM statistics where urlid=?", id)
	err := row.Scan(&count)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Print(count)
	stm, err := db.Prepare("SELECT * FROM statistics where urlid=?")

	checkErr(err)
	rows, errQuery := stm.Query(id)
	if errQuery != nil {
		fmt.Fprintf(w, "no intry")

	}
	//checkErr(errQuery)
	var useage []stats

	for rows.Next() {
		var sta stats
		err = rows.Scan(&sta.ID, &sta.IpAddress, &sta.TimeStamp, &sta.UserAgent, &sta.urlid)
		if err != nil {
			//w.Write( "no data")
			fmt.Println("no data")
		}
		//checkErr(err)
		useage = append(useage, sta)
	}

	jsonB, err := json.Marshal(useage)
	checkErr(err)
	//fmt.Fprintf(w, "%s", string(jsonB))
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonB)

}
func couns(id string) int {
	db, _ := GetDB()
	var count int
	row := db.QueryRow("SELECT COUNT(*) FROM statistics where urlid=?", id)
	err := row.Scan(&count)
	if err != nil {
		log.Fatal(err)
	}
	return count
}
func getAll(w http.ResponseWriter, r *http.Request) {
	db, _ := GetDB()
	var count int
	rows, err := db.Query("SELECT * FROM urls")
	checkErr(err)
	var counts []int
	var myurls []urlstct
	for rows.Next() {
		var myurl urlstct
		err = rows.Scan(&myurl.ID, &myurl.LongURL, &myurl.ShortURL)
		checkErr(err)
		myurls = append(myurls, myurl)
		row := db.QueryRow("SELECT COUNT(*) FROM statistics where urlid=?", myurl.ID)
		err := row.Scan(&count)
		if err != nil {
			log.Fatal(err)
		}

		counts = append(counts, count)
		//fmt.Print(count)
		fmt.Println(count)

	}

	jsonB, errMarshal := json.Marshal(myurls)

	checkErr(errMarshal)
	//w.Write(jsonB)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonB)
	w.Header().Set("Content-Type", "application/json")
	//fmt.Fprintln(w, counts)
	//fmt.Fprintf(w, "%", count)
}
func main() {

	db, _ := GetDB()

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
	mux.HandleFunc("/aj", ExampleHandler)
	mux.HandleFunc("/list", getAll)
	mux.HandleFunc("/stats/", ussage)
	handler := cors.Default().Handler(mux)
	http.ListenAndServe("127.0.0.1:8080", handler)

}
