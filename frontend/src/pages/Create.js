import React, { useState }  from "react";
import { Form, Col, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";

export const Create = () => {
    const [eventName, setEventName] = useState('');
    const [maxAttendees, setMaxAttendees] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        fetch('/api/v1/event', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                eventName,
                maxAttendees,
                startDate,
                startTime,
                endDate,
                endTime
            })
        });

        setRedirect(true);
    }

    if (redirect) {
        return <Redirect to="/events"/>;
    }

  return (
    <div>
      <br></br>
      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <Form.Group as={Col} xs="10"controlId="formGridEventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control required 
            onChange={e=> setEventName(e.target.value)}/>
          </Form.Group>

          <Form.Group as={Col} xs="2" controlId="formGridMaxAttendees">
            <Form.Label>Max Attendees</Form.Label>
            <Form.Control required type="number" min="0" 
            onChange={e=> setMaxAttendees(e.target.value)}/>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control required type="date" 
            onChange={e=> setStartDate(e.target.value)}/>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control required type="time" 
            onChange={e=> setStartTime(e.target.value)}/>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control required type="date" 
            onChange={e=> setEndDate(e.target.value)}/>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control required type="time" 
            onChange={e=> setEndTime(e.target.value)}/>
          </Form.Group>
        </Form.Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};
