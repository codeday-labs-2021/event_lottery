import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
const { REACT_APP_BACKEND_API } = process.env;

export const Events = () => {
  const [events, setEventList] = useState([]);
  
  return (
    <div>
      <br></br>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Event Name</th>
            <th>View Event</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <Button variant="info">Info</Button>{' '}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
