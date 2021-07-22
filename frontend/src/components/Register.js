import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
const baseURL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_API;

export const RegisterForm = ({id, state, onPress}) => {
  // const [userData, setUser] = useState({
  //   firstName: '',
  //   lastName: '',
  //   phoneNumber: ''
  // });

  // const changeHandler = e => {
  //   const newData = { ...userData };
  //   if (e.type !== undefined) {
  //     newData[e.target.name] = e.target.value;
  //     setUser(newData);
  //   }
  //   else
  //     setUser({ ...userData, phoneNumber: e});
  // }

  const registerOccurrence = e => {
    e.preventDefault();
    axios
      .post(`${baseURL}/api/v1/register-occurrence/${id}`)
      .then(response => {
        console.log(response)
        // setUser({firstName: '', lastName: '', phoneNumber: ''})
        onPress(!state)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div>
      <br></br>
      <h1>Register</h1>
      <Button variant="success" size="lg" onClick={registerOccurrence}>Register for Occurrence</Button>
      <br></br>
      {/* <Form onSubmit={submitHandler}>
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
      </Form> */}
    </div>
  );
};
