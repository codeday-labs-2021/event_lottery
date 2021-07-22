import React, { useState, useEffect } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { RegisterForm } from "../components/Register";
import { Candidates } from "../components/Candidates";
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const ViewEditOccurrence = ({ username }) => {
  const [occurrence, setEvent] = useState("");
  const [isRender, renderCandidates] = useState(false);
  const { occurrenceID } = useParams();

  // Same as ComponentDidMount, which dependencies in the []
  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/occurrence/${occurrenceID}`)
      .then((response) => {
        console.log(response);
        setEvent(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const runLottery = (e) => {
    axios
      .get(`${baseURL}/api/v1/user/winner/${occurrenceID}`)
      .then((response) => {
        renderCandidates(!isRender);
        alert("Winners will receive an SMS message shortly");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const viewEditOccurrencePage = (
    <div>
      <div className="inline">
        <h1>{`${username}'s ${occurrence.EventName} Occurrence`}</h1>
        <Button variant="primary" size="lg" onClick={runLottery}>
          Run Lottery
        </Button>
      </div>
      <br></br>
      <Form>
        <Form.Row>
          <Form.Group as={Col} xs="10">
            <Form.Label>Event Name</Form.Label>
            <Form.Control required name="eventName" value={occurrence.EventName} />
          </Form.Group>

          <Form.Group as={Col} xs="2">
            <Form.Label>Max Attendees</Form.Label>
            <Form.Control
              required
              type="number"
              min="0"
              name="maxAttendees"
              value={occurrence.MaxAttendees}
            />
          </Form.Group>
        </Form.Row>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            required
            name="location"
            value={occurrence.Location}
          />
        </Form.Group>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="startDate"
              value={occurrence.StartDate}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="startTime"
              value={occurrence.StartTime}
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
              value={occurrence.EndDate}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>End Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="endTime"
              value={occurrence.EndTime}
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
              value={occurrence.LotteryDate}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Lottery Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="lotteryTime"
              value={occurrence.LotteryTime}
            />
          </Form.Group>
        </Form.Row>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={occurrence.Description}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <br></br>
      <Candidates id={occurrenceID} state={isRender} />
      <RegisterForm id={occurrenceID} state={isRender} onClick={renderCandidates} />
    </div>
  );

  const defaultPage = <h1>You are not logged in</h1>;

  return (
    <div>
      <br></br>
      {username ? viewEditOccurrencePage : defaultPage}
    </div>
  );
};