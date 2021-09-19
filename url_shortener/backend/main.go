package main

import (
	"crypto/sha1"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"

	_ "github.com/mattn/go-sqlite3"
)

func GetDB() (db *sql.DB, err error) {
	db, err = sql.Open("sqlite3", "./urldb.db?_foreign_keys=on")
	if err != nil {
		// Print error and exit if there was problem opening connection.
		log.Fatal(err)
	}

	return
}

var urls = make(map[string]string)

var jwtKey = []byte("secret_key")

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

type count struct {
	Price int `json:",count"`
}
type urlstct struct {
	ID       string
	LongURL  string `json:"longUrl"`
	ShortURL string `json:"shortUrl"`
	UserId   string `json:"userid"`
}
type stats struct {
	ID        int
	IpAddress string
	UserAgent string
	TimeStamp int64
	urlid     string
}

type Credentials struct {
	Password string `json:"password" `
	Username string `json:"username" `
	Email    string `json:"email"`
}

func Signup(w http.ResponseWriter, r *http.Request) {
	db, _ := GetDB()

	creds := &Credentials{}
	err := json.NewDecoder(r.Body).Decode(creds)
	if err != nil {

		w.WriteHeader(http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), 8)

	//
	//if _, err = db.Query("insert into users values ($1, $2, $3)", creds.Username, creds.Email, string(hashedPassword)); err != nil {
	// If there is any issue with inserting into the database, return a 500 error
	//	w.WriteHeader(http.StatusInternalServerError)

	//	return
	//}
	stmt, err := db.Prepare(`
		INSERT INTO users(username,email,password)
		VALUES(?, ?,?)
	`)
	if err != nil {
		fmt.Println("Prepare query error")
		panic(err)
	}
	_, err = stmt.Exec(creds.Username, creds.Email, string(hashedPassword))
	if err != nil {
		fmt.Println("Execute query error")
		panic(err)
	}

}
func Signin(w http.ResponseWriter, r *http.Request) {
	db, _ := GetDB()
	creds := &Credentials{}
	err := json.NewDecoder(r.Body).Decode(creds)
	if err != nil {
		log.Printf("Body parse error, %v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	// Get the existing entry present in the database for the given email
	result := db.QueryRow("select password from users where email=?", creds.Email)
	if err != nil {
		log.Printf("query error, %v", err)
		//log.Printf("Body parse error, %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	storedCreds := &Credentials{}
	//var muser string
	err = result.Scan(&storedCreds.Password)
	if err != nil {

		if err == sql.ErrNoRows {
			log.Printf("id error, %v", err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Compare the stored hashed password, with the hashed version of the password that was received
	if err = bcrypt.CompareHashAndPassword([]byte(storedCreds.Password), []byte(creds.Password)); err != nil {
		// If the two passwords don't match, return a 401 status
		log.Printf("pass compare error, %v", err)
		w.WriteHeader(http.StatusUnauthorized)
	}

	results := db.QueryRow("select username from users where email=?", creds.Email)

	storeduser := &Credentials{}
	err = results.Scan(&storeduser.Username)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("id error, %v", err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
	}

	expirationTime := time.Now().Add(time.Hour * 24)
	fmt.Println("stored user:", storeduser.Username)
	claims := &Claims{
		Username: storeduser.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	fmt.Println("tokenstring:", tokenString)
	http.SetCookie(w,
		&http.Cookie{
			Name:     "token",
			Value:    tokenString,
			Expires:  expirationTime,
			HttpOnly: false,
		})

}

func users(w http.ResponseWriter, req *http.Request) {
	db, _ := GetDB()
	type user struct {
		Username string `json:"username" `
		ID       int    `json:"id"`
	}
	cookie, err := req.Cookie("token")
	fmt.Println("Found a cookie named:", cookie)
	if err != nil {
		if err == http.ErrNoCookie {
			log.Printf("cookie in req error, %v", err)
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(fmt.Sprintf("geting cookie error")))
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tokenStr := cookie.Value

	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(tokenStr, claims,
		func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			log.Printf("parse tkn error, %v", err)
			w.Write([]byte(fmt.Sprintf("parse error")))
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !tkn.Valid {
		log.Printf("not valid tkn error, %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(fmt.Sprintf("token not valid")))
		return
	}
	/*result := db.QueryRow("select id from users where username=?", claims.Username)
	if err != nil {
		log.Printf("query error, %v", err)
		//log.Printf("Body parse error, %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var ouruser user
	//var muser string
	err = result.Scan(&ouruser.ID)
	if err != nil {

		if err == sql.ErrNoRows {
			log.Printf("id error, %v", err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		w.WriteHeader(http.StatusInternalServerError)
		return
	}*/
	//ouruser.Username = claims.Username
	ouruser := &user{}
	rows, err := db.Query("SELECT id, username from users where username=?", claims.Username)
	checkErr(err)

	for rows.Next() {

		err = rows.Scan(&ouruser.ID, &ouruser.Username)
		checkErr(err)
	}
	fmt.Println("the user is:", ouruser)
	jsonB, errMarshal := json.Marshal(ouruser)
	checkErr(errMarshal)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonB)
	//w.Write( claims.Username)

}
func signout(w http.ResponseWriter, req *http.Request) {
	c := &http.Cookie{
		Name:    "token",
		Value:   "",
		Expires: time.Unix(0, 0),
	}
	http.SetCookie(w, c)
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

	h := sha1.Sum([]byte(burl.LongURL))
	key := fmt.Sprintf("%x", h[:5])
	urls[key] = string(burl.LongURL)
	burl.ID = key
	burl.LongURL = string(burl.LongURL)
	burl.ShortURL = "http://localhost:8080/redirect/" + key
	userID, err := strconv.Atoi(burl.UserId)

	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("user id:", userID)
	fmt.Println(ToNullString(""))
	fmt.Println(ToNullString("s"))
	fmt.Println(ToNullInt64("0"))
	fmt.Println(ToNullInt64("1"))
	testnul := ToNullInt64(burl.UserId)

	stmt, err := db.Prepare(`
		INSERT INTO urls(ID,longurl,shorturl,userid)
		VALUES(?, ?,?,?)
	`)
	if err != nil {
		fmt.Println("Prepare query error")
		panic(err)
	}
	_, err = stmt.Exec(burl.ID, burl.LongURL, burl.ShortURL, testnul)
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
func ToNullString(s string) sql.NullString {
	return sql.NullString{String: s, Valid: s != ""}
}
func ToNullInt64(s string) sql.NullInt64 {
	i, _ := strconv.Atoi(s)
	return sql.NullInt64{Int64: int64(i), Valid: int64(i) != 0}
}
func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the HomePage!")
	fmt.Println("Endpoint Hit: homePage")
}
func redirect(w http.ResponseWriter, req *http.Request) {
	db, _ := GetDB()

	type urlst struct {
		ID       string
		LongURL  string        `json:"longUrl"`
		ShortURL string        `json:"shortUrl"`
		UserId   sql.NullInt64 `json:"userid"`
	}
	var myurl urlst
	//var reqstat stats
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
	defer rows.Close()
	for rows.Next() {
		err :=
			rows.Scan(&myurl.ID, &myurl.LongURL, &myurl.ShortURL, &myurl.UserId)
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
	Statistics(req)
	//ua := req.Header.Get("User-Agent")
	//fmt.Println(ua)
	time := time.Now().UnixNano() / int64(time.Millisecond)
	fmt.Println(reflect.TypeOf(time))
	fmt.Println(time)
	//ips := getClientIP(req)

	//fmt.Print(ips)
	//fmt.Println(ips)
	//w.Write(ips)
	/*ip := ReadUserIP(req)
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
	}*/

}
func Statistics(r *http.Request) {
	db, _ := GetDB()
	var reqstat stats
	redirectkey := strings.Join(strings.Split(r.URL.Path, "/")[2:], "/")
	time := time.Now().UnixNano() / int64(time.Millisecond)
	fmt.Println(reflect.TypeOf(time))
	fmt.Println(time)

	ip := ReadUserIP(r)
	fmt.Println(ip)
	userAgent := r.UserAgent()
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
func UserUrls(w http.ResponseWriter, r *http.Request) {

	id := strings.TrimPrefix(r.URL.Path, "/userurls/")
	fmt.Println("id for userurl:", id)
	db, _ := GetDB()

	rows, err := db.Query("SELECT id,longurl,shorturl FROM urls where userid=?", id)
	checkErr(err)

	var myurls []urlstct
	for rows.Next() {
		var myurl urlstct
		err = rows.Scan(&myurl.ID, &myurl.LongURL, &myurl.ShortURL)
		checkErr(err)
		myurls = append(myurls, myurl)

		if err != nil {
			log.Fatal(err)
		}

	}

	jsonB, errMarshal := json.Marshal(myurls)

	checkErr(errMarshal)
	//w.Write(jsonB)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonB)

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

func ussage(w http.ResponseWriter, r *http.Request) {
	db, _ := GetDB()

	//id, _ := ioutil.ReadAll("id")t
	//vars := mux.Vars(r)
	//id, _ := strconv.Atoi(vars["id"])
	type use struct {
		Date   string `json:"date"`
		number int
	}
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
	var dayf []string
	var useage []stats
	var times []int64
	for rows.Next() {
		var sta stats
		err = rows.Scan(&sta.ID, &sta.IpAddress, &sta.TimeStamp, &sta.UserAgent, &sta.urlid)
		if err != nil {
			//w.Write( "no data")
			fmt.Println("no data")
		}
		//checkErr(err)
		useage = append(useage, sta)
		//tm, err := time.Parse(useage[3])
		fmt.Println(sta.TimeStamp)

		times = append(times, sta.TimeStamp)
		dayf = append(dayf, time.Unix(sta.TimeStamp/1000, 0).Format("2006/01/02"))
	}
	fmt.Println(times)
	fmt.Println("formsted days", dayf)
	var hitCountByDate = make(map[string]int)
	max := times[0]
	min := times[0]
	for i := 0; i < len(times); i++ {
		//max := times[0]
		//min := times[0]

		if times[i] > max {
			max = times[i]
		}
		if times[i] < min {
			min = times[i]
		}

	}

	fmt.Println("min", min)
	fmt.Println("max", max)
	var minformated = time.Unix(min/1000, 0).Format("2006/01/02")
	var maxformated = time.Unix(max/1000, 0).Format("2006/01/02")
	fmt.Println("formated min", minformated)
	fmt.Println("formated max", maxformated)

	t, err := time.Parse("2006/01/02", minformated)
	s, err := time.Parse("2006/01/02", maxformated)
	if err != nil {
		panic(err)
	}

	var minday time.Time = time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
	var maxday time.Time = time.Date(s.Year(), s.Month(), s.Day(), 0, 0, 0, 0, s.Location())
	fmt.Println("time.time min", minday)
	fmt.Println("time.time max", maxday)
	fmt.Println("times ary", times)
	//var curtime time.Time = minday

	fmt.Println("ttimes at 1", times[0])
	for i := 0; i < len(times); i++ {
		//unixTimeUTC := time.Unix(s, 0)
		//mytime := time.Unix(int64(times[i])/1000, 0)
		//s := strconv.FormatInt(-42, 16)
		frd := time.Unix(times[i]/1000, 0).Format("2006/01/02")
		fmt.Println(frd)
		fmt.Println(i)
		_, ok := hitCountByDate[frd]
		if ok {
			hitCountByDate[frd]++
		} else { // This is the first time we've seen this day in the data, so this is the first click on the date to be recorded.
			hitCountByDate[frd] = 1
		}
		//fmt.Println(unixTimeUTC, mytime)
	}

	fmt.Println(hitCountByDate)

	fmt.Println(getsdates(minformated, maxformated, hitCountByDate))
	jsonmap, err := json.Marshal(times)

	w.Header().Set("Content-Type", "application/json")
	checkErr(err)
	w.Write(jsonmap)
	//unixTimeUTC := time.Unix(times, 0)
	//i, err := strconv.ParseInt(times, 10, 64)
	//time := time.Unix(times, 0).Format(time.RFC822Z)

}

func getsdates(start string, end string, add map[string]int) map[string]int {
	var alldates = add
	fmt.Println("map", alldates)
	t, err := time.Parse("2006/01/02", start)
	s, err := time.Parse("2006/01/02", end)
	if err != nil {
		panic(err)
	}
	var minday time.Time = time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
	var maxday time.Time = time.Date(s.Year(), s.Month(), s.Day(), 0, 0, 0, 0, s.Location())

	var curtime time.Time = minday

	for curtime.Before(maxday) || curtime.Equal(maxday) {
		//_, ok := alldates[curtime.Format("2006/01/02")]
		//if alldates[curtime.Format("2006/01/02")]!= {
		//	continue
		//}
		if value, exist := alldates[curtime.Format("2006/01/02")]; exist {
			fmt.Println("same v", value)
			curtime = curtime.Add(24 * time.Hour)
		} else {
			alldates[curtime.Format("2006/01/02")] = 0
		}
	}
	return alldates

}

func getAll(w http.ResponseWriter, r *http.Request) {
	type urlst struct {
		ID       string
		LongURL  string        `json:"longUrl"`
		ShortURL string        `json:"shortUrl"`
		UserId   sql.NullInt64 `json:"userid"`
	}
	db, _ := GetDB()
	var count int
	rows, err := db.Query("SELECT * FROM urls")
	checkErr(err)
	var counts []int
	var myurls []urlst
	for rows.Next() {
		var myurl urlst
		err = rows.Scan(&myurl.ID, &myurl.LongURL, &myurl.ShortURL, &myurl.UserId)
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
	stm, err := db.Prepare("SELECT*  FROM users where id=?")
	rowsm, errQuery := stm.Query(3)
	checkErr(err)

	if errQuery != nil {
		fmt.Println("no intry")

	}

	//rowsm, _ := db.Query("SELECT FROM users where id=?", 2)
	var username string
	var email string
	var password string
	var iD int
	for rowsm.Next() {
		rowsm.Scan(&iD, &username, &email, &password)
		fmt.Println("usr usern", username)
		fmt.Println("email", email)
		fmt.Println(iD)
		fmt.Println("password", password)
	}
	mux := http.NewServeMux()
	//mux.HandleFunc("/redirect/", redirect)
	mux.HandleFunc("/redirect/", redirect)
	mux.HandleFunc("/register", register)

	mux.HandleFunc("/list", getAll)
	mux.HandleFunc("/stats/", ussage)
	mux.HandleFunc("/signup", Signup)
	mux.HandleFunc("/signin", Signin)
	mux.HandleFunc("/user", users)
	mux.HandleFunc("/signout", signout)
	mux.HandleFunc("/userurls/", UserUrls)
	handler := cors.Default().Handler(mux)
	http.ListenAndServe("127.0.0.1:8080", handler)

}
