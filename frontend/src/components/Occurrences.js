import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import axios from "axios";
const baseURL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_API;

export const Occurrences = ({ id }) => {
  const [occurrences, setOccurrences] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/occurrences/${id}`)
      .then((response) => {
        console.log(response);
        setOccurrences(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Occurrences</h1>
      {
        <ListGroup>
          {occurrences.slice(0).reverse().map((row) => {
            return (
              <ListGroup.Item action>
                Event Name: {row.EventName}, Location: {row.Location},
                From: {row.StartDate} at {row.StartTime} to {row.EndDate} at {row.EndTime}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      }
      <br></br>
    </div>
  );
};
