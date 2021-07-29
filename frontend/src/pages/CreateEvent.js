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
    location: "",
    description: "",
    owner: username,
    userID: id.toString(),
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
        </Form.Row>

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
