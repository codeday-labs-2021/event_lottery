import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const SignIn = ({setUsername}) => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [redirect, setRedirect] = useState(false);

  const handleChanges = (event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/api/v1/login`, input)
      .then((response) => {
        console.log(response.data);
        setRedirect(true);
        setUsername(response.data.Username)
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <br></br>
      <Form onSubmit={handleSubmit}>
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
    </div>
  );
};
