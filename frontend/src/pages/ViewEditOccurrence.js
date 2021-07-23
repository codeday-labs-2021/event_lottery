import React, { useState, useEffect } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { RegisterForm } from "../components/Register";
import { Candidates } from "../components/Candidates";
import { Trash, Trophy } from "react-bootstrap-icons";
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const ViewEditOccurrence = ({ username }) => {
  const history = useHistory();
  const [occurrence, setOccurrence] = useState("");
  const [isRender, renderCandidates] = useState(false);
  const { occurrenceID } = useParams();

  // Same as ComponentDidMount, which dependencies in the []
  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/occurrence/${occurrenceID}`)
      .then((response) => {
        console.log(response);
        setOccurrence(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const changeHandler = (e) => {
    const newData = { ...occurrence };
    newData[e.target.name] = e.target.value;
    setOccurrence(newData);
  };

  const runLottery = (e) => {
    axios
      .get(`${baseURL}/api/v1/occurrence-winner/${occurrenceID}`)
      .then((response) => {
        renderCandidates(!isRender);
        alert("Winner(s) will receive an SMS message shortly");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cancelOccurrence = (e) => {
    axios
      .post(`${baseURL}/api/v1/cancel-occurrence/${occurrenceID}`)
      .then((response) => {
        console.log(response);
        history.push(`/event/${occurrence.EventID}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/api/v1/reschedule-occurrence/${occurrenceID}`, occurrence)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const viewEditOccurrencePage = (
    <div>
      <div className="inline">
        <h1>{`${occurrence.EventName} Occurrence`}</h1>
        <div className="test">
        <Button variant="primary" size="lg" onClick={cancelOccurrence}>
          <Trash /> Cancel Occurrence
        </Button>
        <div class="divider"/>
        <Button variant="primary" size="lg" onClick={runLottery}>
          <Trophy /> Run Lottery
        </Button>
        </div>
      </div>
      <br></br>
      <Form onSubmit={updateHandler}>
        <Form.Row>
          <Form.Group as={Col} xs="10">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              required
              name="EventName"
              value={occurrence.EventName}
            />
          </Form.Group>

          <Form.Group as={Col} xs="2">
            <Form.Label>Max Attendees</Form.Label>
            <Form.Control
              required
              type="number"
              min="0"
              name="MaxAttendees"
              value={occurrence.MaxAttendees}
            />
          </Form.Group>
        </Form.Row>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control required name="Location" onChange={changeHandler} value={occurrence.Location} />
        </Form.Group>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="StartDate"
              onChange={changeHandler}
              value={occurrence.StartDate}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="StartTime"
              onChange={changeHandler}
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
              name="EndDate"
              onChange={changeHandler}
              value={occurrence.EndDate}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>End Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="EndTime"
              onChange={changeHandler}
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
              name="LotteryDate"
              value={occurrence.LotteryDate}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Lottery Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="LotteryTime"
              value={occurrence.LotteryTime}
            />
          </Form.Group>
        </Form.Row>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="Description"
            value={occurrence.Description}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
      <br></br>
      <Candidates id={occurrenceID} state={isRender} />
      <RegisterForm
        id={occurrenceID}
        state={isRender}
        onPress={renderCandidates}
      />
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
