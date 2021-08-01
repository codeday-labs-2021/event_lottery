import React, { useState, useEffect } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Occurrences } from "../components/Occurrences";
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const ViewEditEvent = () => {
  const [event, setEvent] = useState("");
  const { eventID } = useParams();

  // Same as ComponentDidMount, which dependencies in the []
  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/event/${eventID}`)
      .then((response) => {
        console.log(response);
        setEvent(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <br></br>
      <div>
        <div className="inline">
          <h1>{`${event.Owner}'s ${event.EventName}`}</h1>
        </div>
        <br></br>
        <Form>
          <Form.Row>
            <Form.Group as={Col} xs="7">
              <Form.Label>Event Name</Form.Label>
              <Form.Control required name="eventName" value={event.EventName} />
            </Form.Group>

            <Form.Group as={Col} xs="5">
              <Form.Label>Owner</Form.Label>
              <Form.Control required name="owner" value={event.Owner} />
            </Form.Group>
          </Form.Row>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control required name="location" value={event.Location} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={event.Description}
            />
          </Form.Group>

          {/* <Button variant="primary" type="submit">
            Submit
          </Button> */}
        </Form>
        <br></br>
        <Occurrences id={eventID} />
        <Button variant="primary" href={`/event/${eventID}/create-occurrence`}>
          Create Occurrence
        </Button>
      </div>
    </div>
  );
};
