import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const Home = ({ username, id }) => {
  const [users, setUsers] = useState({ events: [], occurrences: [] });
  const history = useHistory();

  // Same as ComponentDidMount, which dependencies in the []
  useEffect(() => {
    const fetchData = async () => {
      const userEvents = await axios.get(`${baseURL}/api/v1/user-events/${id}`);
      const userOccurrences = await axios.get(`${baseURL}/api/v1/user-occurrences/${id}`);
      setUsers({ events: userEvents.data, occurrences: userOccurrences.data });
    };
    fetchData();
  }, []);

  const userHome = (
    <div>
      <h1>{`Welcome to the Event Lottery System, ${username}!`}</h1>
      <br></br>
      <h2>Your Events</h2>
      <Table striped bordered hover className="textcenter">
        <thead>
          <tr>
            <th>Event ID</th>
            <th width={"70%"}>Event Name</th>
            <th>View Event</th>
          </tr>
        </thead>
        <tbody>
          {users.events && users.events.map((row) => {
                return (
                  <tr>
                    <td>{row.ID}</td>
                    <td>{row.EventName}</td>
                    <td>
                      <Button
                        onClick={() => history.push(`/event/${row.ID}`)}
                        variant="info"
                      >
                        View Event
                      </Button>
                    </td>
                  </tr>
                );
            })}
        </tbody>
      </Table>
      <br></br>
      <h2>Upcoming Occurrences</h2>
      <Table striped bordered hover className="textcenter">
        <thead>
          <tr>
            <th >Occurrence ID</th>
            <th width={"30%"}>Occurrence Name</th>
            <th >Date & Time</th>
            <th >Location</th>
            <th >View Occurrence</th>
          </tr>
        </thead>
        <tbody>
        {users.occurrences && users.occurrences.map((row) => {
                return (
                  <tr>
                    <td>{row.ID}</td>
                    <td>{row.EventName}</td>
                    <td>{`${row.StartDate}, ${row.StartTime}`}</td>
                    <td>{row.Location}</td>
                    <td>
                      <Button
                        onClick={() => history.push(`/occurrence/${row.ID}`)}
                        variant="info"
                      >
                        View Occurrence
                      </Button>
                    </td>
                  </tr>
                );
            })}
        </tbody>
      </Table>
    </div>
  );

  return (
    <div>
      <br></br>
      {username ? userHome : <h1>Welcome to the Event Lottery System</h1>}
    </div>
  );
};
