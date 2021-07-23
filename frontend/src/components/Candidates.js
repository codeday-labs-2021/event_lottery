import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import axios from "axios";
const baseURL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_API;

export const Candidates = ({ id, state }) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/candidates/${id}`)
      .then((response) => {
        console.log(response);
        setCandidates(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [state]);

  return (
    <div>
      <h1>Candidates</h1>
      {
        <ListGroup>
          {candidates && candidates.map((row) => {
            return (
              <ListGroup.Item>
                Name: {row.FirstName} {row.LastName}, Phone: {row.PhoneNumber}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      }
    </div>
  );
};
