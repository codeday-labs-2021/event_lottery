import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export const RegisterForm = ({changeHandler, user}) => {
  return (
    <div>
      <br></br>
      <h1>Register</h1>
      <Form>
        <Form.Row>
          <Form.Group as={Col} xs="4">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              required
              name="firstName"
              onChange={changeHandler}
              value={{user}.firstName}
            />
          </Form.Group>

          <Form.Group as={Col} xs="4">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              required
              name="lastName"
              onChange={changeHandler}
              value={{user}.lastName}
            />
          </Form.Group>

          <Form.Group as={Col} xs="4">
            <Form.Label>Phone Number</Form.Label>
            <PhoneInput
              required
              name="phoneNumber"
              country={"us"}
              onChange={changeHandler}
              value={{user}.phoneNumber}
            />
          </Form.Group>
        </Form.Row>

        <Button xs="6" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};
