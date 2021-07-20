import React from "react";

export const Home = ({username}) => {
  return (
    <div>
      <br></br>
      <h1>{username ? `Welcome to the Event Lottery System, ${username}!` : 'You are not logged in'}</h1>
    </div>
  );
};
