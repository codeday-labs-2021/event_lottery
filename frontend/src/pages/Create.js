import React, { useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
const baseURL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_API;

export const Create = ({username}) => {
  const [formData, setData] = useState({
      eventName: '',
      maxAttendees: 0,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      lotteryDate: '',
      lotteryTime: ''
  });

  const history = useHistory();

  const changeHandler = e => {
    const newData = { ...formData }
    newData[e.target.name] = e.target.value;
    setData(newData);
  }
 
  const submitHandler = e => {
    e.preventDefault();
    axios
      .post(`${baseURL}/api/v1/event`, formData)
      .then(response => {
        console.log(response)
        history.push(`/event/${response.data.ID}`);
      })
      .catch(error => {
        console.log(error)
      })
  }

  const createPage = (
    <div>
      <br></br>
      <Form onSubmit={submitHandler}>
        <Form.Row>
          <Form.Group as={Col} xs="10" controlId="formGridEventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              required
              name="eventName"
              onChange={changeHandler}
              value={formData.eventName}
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
              value={formData.maxAttendees}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
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
        </Form.Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  )

  const defaultPage = <h1>You are not logged in</h1>

  return (
    <div>
      <br></br>
      {username ? createPage : defaultPage}
    </div>
  );
};
