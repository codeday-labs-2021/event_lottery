import React, { useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const CreateEvent = ({ username, id }) => {
  const [formData, setData] = useState({
    eventName: "",
    // maxAttendees: 0,
    location: "",
    description: "",
    // startDate: "",
    // startTime: "",
    // endDate: "",
    // endTime: "",
    // lotteryDate: "",
    // lotteryTime: "",
    // occurrences: "1",
    owner: id.toString(),
  });

  const history = useHistory();

  const changeHandler = (e) => {
    const newData = { ...formData };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/api/v1/event`, formData)
      .then((response) => {
        console.log(response);
        history.push(`/event/${response.data.ID}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createPage = (
    <div>
      <h1>Create an Event</h1>
      <br></br>
      <Form onSubmit={submitHandler}>
        <Form.Row>
          <Form.Group as={Col} xs="5" controlId="formGridEventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              required
              name="eventName"
              onChange={changeHandler}
              value={formData.eventName}
            />
          </Form.Group>
          <Form.Group as={Col} xs="7" controlId="formGridAddress">
          <Form.Label>Location</Form.Label>
          <Form.Control
            required
            name="location"
            onChange={changeHandler}
            value={formData.location}
          />
        </Form.Group>
          {/* <Form.Group as={Col} xs="2" controlId="formGridMaxAttendees">
            <Form.Label>Max Attendees</Form.Label>
            <Form.Control
              required
              type="number"
              min="0"
              name="maxAttendees"
              onChange={changeHandler}
              value={formData.maxAttendees}
            />
          </Form.Group>

          <Form.Group as={Col} xs="2" controlId="formGridOccurrences">
            <Form.Label>Occurrences</Form.Label>
            <Form.Control
              as="select"
              name = "occurrences"
              onChange={changeHandler}
              value={formData.occurrences}   
            >
              <option value="1">Does not repeat</option>
              <option value="2">Daily</option>
              <option value="3">Weekly</option>
              <option value="4">Monthly</option>
            </Form.Control>
          </Form.Group> */}
        </Form.Row>



        {/* <Form.Row>
          <Form.Group as={Col} controlId="formGridStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="startDate"
              onChange={changeHandler}
              value={formData.startDate}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="startTime"
              onChange={changeHandler}
              value={formData.startTime}
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
              value={formData.endDate}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="endTime"
              onChange={changeHandler}
              value={formData.endTime}
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
              value={formData.lotteryDate}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridLotteryTime">
            <Form.Label>Lottery Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="lotteryTime"
              onChange={changeHandler}
              value={formData.lotteryTime}
            />
          </Form.Group>
        </Form.Row> */}

        <Form.Group className="mb-3" controlId="formGridDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            onChange={changeHandler}
            value={formData.description}
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
      {username ? createPage : defaultPage}
    </div>
  );
};