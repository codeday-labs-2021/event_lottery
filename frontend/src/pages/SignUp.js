import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Redirect } from "react-router-dom";
import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const SignUp = () => {
  const [userInput, setUserInput] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    username: "",
    email: "",
    password: "",
  });
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null)
  const handleChanges = (e) => {
    const newData = { ...userInput };
    if (e.type !== undefined) {
      newData[e.target.name] = e.target.value;
      setUserInput(newData);
    } else setUserInput({ ...userInput, phoneNumber: e });
  };

  const handleSubmit = (e) => {
    setError(null);
    e.preventDefault();
    axios
      .post(`${baseURL}/api/v1/signup`, userInput)
      .then((response) => {
        console.log(response.data);
        setRedirect(true);
      })
      .catch((error) => {
        console.log(error);
        if (error && error.response) setError(error.response.data.message);
      });
  };

  if (redirect) {
    return <Redirect to="/signin" />;
  }

  return (
    <div>
      <br></br>
      <Form onSubmit={handleSubmit}>
      <div class="alart alert-danger" role="alert">{error ? error : ""}</div>
        <h3>Sign Up</h3>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First name"
              required
              name="firstName"
              onChange={handleChanges}
              value={userInput.firstName}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last name"
              required
              name="lastName"
              onChange={handleChanges}
              value={userInput.lastName}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              required
              name="username"
              onChange={handleChanges}
              value={userInput.username}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <PhoneInput
              placeholder="Enter phone number"
              required
              name="phoneNumber"
              country={"us"}
              onChange={handleChanges}
              value={userInput.phoneNumber}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              name="email"
              onChange={handleChanges}
              value={userInput.email}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              name="password"
              onChange={handleChanges}
              value={userInput.password}
            />
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </div>
  );
};
