import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const SignIn = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleChanges = (event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestConfig = {
      url: `${baseURL}/api/v1/singnin`,
      method: "post",
      header: { "Content-Type": "application/jason" },
      data: {
        email: input.email,
        password: input.password,
      },
    };
    axios(requestConfig)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  };

  return (
    <Form>
      <h3>Sign In</h3>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            name="email"
            onChange={handleChanges}
            value={input.email}
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
            value={input.password}
          />
        </Form.Group>
      </Row>
      <Button variant="primary" type="submit">
        Sign In
      </Button>
    </Form>
  );
};
