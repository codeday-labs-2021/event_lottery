import React, { useState, useEffect } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const CreateOccurrence = ({ username }) => {
  const { eventID } = useParams();
  const [occurrenceData, setOccurrenceData] = useState({
    eventName: "",
    maxAttendees: 0,
    location: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    lotteryDate: "",
    lotteryTime: "",
    eventID: eventID,
  });
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/event/${eventID}`)
      .then((response) => {
        const newData = { ...occurrenceData };
        newData.eventName = response.data.EventName;
        newData.location = response.data.Location;
        newData.description = response.data.Description;
        setOccurrenceData(newData);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const changeHandler = (e) => {
    const newData = { ...occurrenceData };
    newData[e.target.name] = e.target.value;
    setOccurrenceData(newData);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/api/v1/occurrence`, occurrenceData)
      .then((response) => {
        console.log(response);
        history.push(`/occurrence/${response.data.ID}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createOccurence = (
    <div>
      <h1>Create an Occurrence</h1>
      <br></br>
      <Form onSubmit={submitHandler}>
        <Form.Row>
          <Form.Group as={Col} xs="10" controlId="formGridEventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              required
              name="eventName"
              onChange={changeHandler}
              value={occurrenceData.eventName}
            />
          </Form.Group>
          <Form.Group as={Col} xs="2" controlId="formGridMaxAttendees">
            <Form.Label>Max Attendees</Form.Label>
            <Form.Control
              required
              type="number"
              min="0"
              name="maxAttendees"
              onChange={changeHandler}
              value={occurrenceData.maxAttendees}
            />
          </Form.Group>
        </Form.Row>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            required
            name="location"
            onChange={changeHandler}
            value={occurrenceData.location}
          />
        </Form.Group>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="startDate"
              onChange={changeHandler}
              value={occurrenceData.startDate}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="startTime"
              onChange={changeHandler}
              value={occurrenceData.startTime}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="endDate"
              onChange={changeHandler}
              value={occurrenceData.endDate}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="endTime"
              onChange={changeHandler}
              value={occurrenceData.endTime}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridLotteryDate">
            <Form.Label>Lottery Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="lotteryDate"
              onChange={changeHandler}
              value={occurrenceData.lotteryDate}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridLotteryTime">
            <Form.Label>Lottery Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="lotteryTime"
              onChange={changeHandler}
              value={occurrenceData.lotteryTime}
            />
          </Form.Group>
        </Form.Row>

        <Form.Group className="mb-3" controlId="formGridDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            onChange={changeHandler}
            value={occurrenceData.description}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );

  const defaultPage = <h1>You are not logged in</h1>;

  return (
    <div>
      <br></br>
      {username ? createOccurence : defaultPage}
    </div>
  );
};
