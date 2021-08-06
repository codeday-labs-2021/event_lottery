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

## Features
* SMS-based notifications and confirmations (two-way SMS)
* Event creation and registration
* Rescheduling and cancelling occurrences
* Weighted lottery raffle with penalities for absent attendees
* Signup, login, logout