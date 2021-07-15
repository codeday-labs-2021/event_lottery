import React, { useState, useEffect } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { RegisterForm } from '../components/Register';
const { REACT_APP_BACKEND_API } = process.env;

export const ViewEditEvent = () => {
  const [event, setEvent] = useState("");
  const { eventID } = useParams();
  const [candidates, setCandidates] = useState([]);
  // Same as ComponentDidMount, which dependencies in the []
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:4001/api/v1/event/${eventID}`)
      .then(response => {
        console.log(response)
        setEvent(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:4001/api/v1/user/${eventID}`)
      .then(response => {
        console.log(response)
        setCandidates(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  return (
    <div>
      <br></br>
      <h1>{event.EventName}</h1>
      <Form>
        <Form.Row>
          <Form.Group as={Col} xs="10">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              required
              name="eventName"
              value={event.EventName}
            />
          </Form.Group>

          <Form.Group as={Col} xs="2">
            <Form.Label>Max Attendees</Form.Label>
            <Form.Control
              required
              type="number"
              min="0"
              name="maxAttendees"
              value={event.MaxAttendees}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="startDate"
              value={event.StartDate}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="startTime"
              value={event.StartTime}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="endDate"
              value={event.EndDate}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>End Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="endTime"
              value={event.EndTime}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Lottery Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="lotteryDate"
              value={event.LotteryDate}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Lottery Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="lotteryTime"
              value={event.LotteryTime}
            />
          </Form.Group>
        </Form.Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <br></br>
      <RegisterForm id={eventID} />
      <br></br>
      <div  >
        <ul class="list-group" as={Col} xs="2">
          <li class="list-group-item list-group-item-dark">Candidates</li>
          {candidates.map(row => {
            return <li class="list-group-item">

              <li class="list-group-item">{row.FirstName} {""}  {row.LastName}</li>
            </li>
          })}

        </ul>
      </div>

    </div>
  );
};
