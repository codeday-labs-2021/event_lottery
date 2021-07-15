import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import axios from "axios";
const { REACT_APP_BACKEND_API } = process.env;

export const Candidates = ({ id }) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios
      .get(`${REACT_APP_BACKEND_API}/api/v1/user/${id}`)
      .then((response) => {
        console.log(response);
        setCandidates(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Candidates</h1>
      {
        <ListGroup>
          {candidates.map((row) => {
            return (
              <ListGroup.Item>
                Name: {row.FirstName} {row.LastName}, Phone: {row.PhoneNumber},
                Invited: {row.Invite ? "Yes" : "No"}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      }
    </div>
  );
};
