import React, { useState, useEffect } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { RegisterForm } from "../components/Register";
import { Candidates } from "../components/Candidates";
import { Trash, Trophy, ArrowLeft } from "react-bootstrap-icons";
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const ViewEditOccurrence = ({ username }) => {
  const history = useHistory();
  const [occurrence, setOccurrence] = useState({
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
    eventID: 0,
  });
  const [isRender, renderCandidates] = useState(false);
  const { occurrenceID } = useParams();

  // Same as ComponentDidMount, which dependencies in the []
  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/occurrence/${occurrenceID}`)
      .then((response) => {
        const newData = { ...occurrence };
        newData.eventName = response.data.EventName;
        newData.maxAttendees = response.data.MaxAttendees.toString();
        newData.location = response.data.Location;
        newData.description = response.data.Description;
        newData.startDate = response.data.StartDate;
        newData.startTime = response.data.StartTime;
        newData.endDate = response.data.EndDate;
        newData.endTime = response.data.EndTime;
        newData.lotteryDate = response.data.LotteryDate;
        newData.lotteryTime = response.data.LotteryTime;
        newData.eventID = response.data.EventID.toString();
        setOccurrence(newData);
        console.log(response);
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
        console.log(response);
        if (response.data === null) {
          alert(
            "Please have at least one candidate before running the lottery!"
          );
        } else {
          alert("Winner(s) will receive an SMS message shortly");
          renderCandidates(!isRender);
        }
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
        history.push(`/event/${occurrence.eventID}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        `${baseURL}/api/v1/reschedule-occurrence/${occurrenceID}`,
        occurrence
      )
      .then((response) => {
        console.log(response);
        history.push(`/occurrence/${occurrenceID}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <br></br>
      <div>
        <div className="inline">
          <Button
            variant="primary"
            size="lg"
            onClick={() => history.push(`/event/${occurrence.eventID}`)}
          >
            <ArrowLeft /> Back to Event
          </Button>
          <div className="test">
            <Button variant="primary" size="lg" onClick={cancelOccurrence}>
              <Trash /> Cancel Occurrence
            </Button>
            <div class="divider" />
            <Button variant="primary" size="lg" onClick={runLottery}>
              <Trophy /> Run Lottery
            </Button>
          </div>
        </div>
        <br></br>
        <Form onSubmit={updateHandler}>
          <Form.Row>
            <Form.Group as={Col} xs="10">
              <Form.Label>Occurence Name</Form.Label>
              <Form.Control
                required
                name="eventName"
                value={occurrence.eventName}
              />
            </Form.Group>

            <Form.Group as={Col} xs="2">
              <Form.Label>Max Attendees</Form.Label>
              <Form.Control
                required
                type="number"
                min="0"
                name="maxAttendees"
                value={occurrence.maxAttendees}
              />
            </Form.Group>
          </Form.Row>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              required
              name="location"
              value={occurrence.location}
            />
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                required
                type="date"
                name="startDate"
                onChange={changeHandler}
                value={occurrence.startDate}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                required
                type="time"
                name="startTime"
                onChange={changeHandler}
                value={occurrence.startTime}
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
                onChange={changeHandler}
                value={occurrence.endDate}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>End Time</Form.Label>
              <Form.Control
                required
                type="time"
                name="endTime"
                onChange={changeHandler}
                value={occurrence.endTime}
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
                value={occurrence.lotteryDate}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Lottery Time</Form.Label>
              <Form.Control
                required
                type="time"
                name="lotteryTime"
                value={occurrence.lotteryTime}
              />
            </Form.Group>
          </Form.Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={occurrence.description}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
        <br></br>
        <Candidates
          id={occurrenceID}
          state={isRender}
          onPress={renderCandidates}
        />
        <RegisterForm
          id={occurrenceID}
          state={isRender}
          onPress={renderCandidates}
          username={username}
        />
      </div>
    </div>
  );
};
