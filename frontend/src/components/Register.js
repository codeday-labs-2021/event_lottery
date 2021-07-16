import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
const { REACT_APP_BACKEND_API } = process.env;

export const RegisterForm = ({id, state, onClick}) => {
  const [userData, setUser] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const changeHandler = e => {
    const newData = { ...userData };
    if (e.type !== undefined) {
      newData[e.target.name] = e.target.value;
      setUser(newData);
    }
    else
      setUser({ ...userData, phoneNumber: e});
  }

  const submitHandler = e => {
    e.preventDefault();
    axios
      .post(`${REACT_APP_BACKEND_API}/api/v1/user/${id}`, userData)
      .then(response => {
        console.log(response)
        setUser({firstName: '', lastName: '', phoneNumber: ''})
        onClick(!state)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div>
      <br></br>
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        <Form.Row>
          <Form.Group as={Col} xs="4">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              required
              name="firstName"
              onChange={changeHandler}
              value={userData.firstName}
            />
          </Form.Group>

          <Form.Group as={Col} xs="4">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              required
              name="lastName"
              onChange={changeHandler}
              value={userData.lastName}
            />
          </Form.Group>

          <Form.Group as={Col} xs="4">
            <Form.Label>Phone Number</Form.Label>
            <PhoneInput
              required
              name="phoneNumber"
              country={"us"}
              onChange={changeHandler}
              value={userData.phoneNumber}
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
