import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const Candidates = ({ id, state }) => {
  const [candidates, setCandidates] = useState({ info: [], invite: [] });

  useEffect(() => {
    const fetchData = async () => {
      const respInfo = await axios.get(`${baseURL}/api/v1/candidates/${id}`);
      const respInvite = await axios.get(
        `${baseURL}/api/v1/occurrence-winners/${id}`
      );
      setCandidates({ info: respInfo.data, invite: respInvite.data });
    };
    fetchData();
  }, [state]);

  return (
    <div>
      <h1>Candidates</h1>
      {
        <ListGroup>
          {candidates &&
            candidates.info.map((row, index) => {
              return (
                <ListGroup.Item>
                  Name: {row.FirstName} {row.LastName}, Phone: {row.PhoneNumber}
                  , Status:{" "}
                  {candidates.invite[index]
                    ? candidates.invite[index] !== 1
                      ? candidates.invite[index] === 2
                        ? "Invitation Accepted!"
                        : "Invitation Declined"
                      : "Invitation Sent!"
                    : "No Invitation"}
                </ListGroup.Item>
              );
            })}
        </ListGroup>
      }
    </div>
  );
};
