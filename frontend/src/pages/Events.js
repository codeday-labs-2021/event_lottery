import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
const baseURL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_API;

export const Events = ({username}) => {
  const [eventData, setData] = useState([]);
  const history = useHistory();

  // Same as ComponentDidMount, which dependencies in the []
  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/event`)
      .then(response => {
        console.log(response)
        setData(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const eventsPage = (
    <Table striped bordered hover className="textcenter">
    <thead>
      <tr>
        <th>Event ID</th>
        <th width={'70%'}>Event Name</th>
        <th>View Event</th>
      </tr>
    </thead>
    <tbody>
      {eventData && eventData.map(row => {
        return <tr>
        <td>{row.ID}</td>
        <td>{row.EventName}</td>
        <td><Button onClick={() => history.push(`/event/${row.ID}`)} variant="info">View Event</Button></td>
      </tr>
      })}
    </tbody>
  </Table>
  )

  const defaultPage = <h1>You are not logged in</h1>

  return (
    <div>
      <br></br>
      {username ? eventsPage : defaultPage}
    </div>
  );
};
