# Lottery Event
Event Lottery is a service & web application for weighted lottery based event registration that utilizes SMS notifications.

## Description
Event Lottery is a website anyone can use create events and invite friends, but the service holds a lottery in order to determine who receives a formal invitation. Useful for cases where you have reoccurring IRL events with limited capacity, and where you want people who haven't had the chance to attend to have a higher chance of being chosen than those who've attended before.

## Technologies
Frontend:
* React
* React Bootstrap
* React Router
* Axios (HTTP client)

Backend:
* Golang
* Fiber (Web framework)
* GORM (PostgreSQL ORM)
* JSON Web Token (Authentication)
* AWS EC2 & RDS (Deployment)
* Twilio API

## Setup
### Prerequisites
* Go: https://golang.org/doc/install
* npm: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

### Frontend
In the project directory,
```
$ cd frontend
$ npm install
$ npm start
```
### Backend
```
$ cd backend
$ go run main.go
```

## Environment Variables
### Frontend
Create a .env file in the frontend directory,
```
NODE_ENV='development'
REACT_APP_BACKEND_API=http://localhost:4000
```

### Backend
Create a .env file in the backend directory,
```
PORT=":4000"
HOST=
DBPORT=
NAME=
DB=
PASSWORD=
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_PHONE_NUMBER=
```

## Features
* SMS-based notifications and confirmations (two-way SMS)
* Event creation and registration
* Rescheduling and cancelling occurrences
* Tracks registered users' created events and upcoming occurrences
* Weighted lottery raffle with penalities for absent attendees
* Signup, login, logout

## Contributors
Feel free to connect with us on LinkedIn!
* [William Wang](https://www.linkedin.com/in/wangywilliam/)
* [Abenezer Taddesse](https://www.linkedin.com/in/abenezer-taddesse-349ba1183/)