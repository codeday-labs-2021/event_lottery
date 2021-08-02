import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const RegisterForm = ({ id, state, onPress, username }) => {
  const [userData, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState(false);

  const changeHandler = (e) => {
    const newData = { ...userData };
    if (e.type !== undefined) {
      newData[e.target.name] = e.target.value;
      setUser(newData);
    } else setUser({ ...userData, phoneNumber: e });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/api/v1/candidates-unregistered/${id}`, userData)
      .then((response) => {
        console.log(response);
        setUser({ firstName: "", lastName: "", phoneNumber: "" });
        onPress(!state);
        setError(false);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  };

  const registerOccurrence = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/api/v1/candidates-registered/${id}`)
      .then((response) => {
        console.log(response);
        onPress(!state);
        setError(false);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  };

  return (
    <div>
      <br></br>
      <h1>Register</h1>
      <div class="text-danger">{error ? error : ""}</div>
      {username ? (
        <Button variant="success" size="lg" onClick={registerOccurrence}>
          Register for Occurrence
        </Button>
      ) : (
        <Form onSubmit={submitHandler}>
          <div class="text-danger">{error ? error : ""}</div>
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
      )}
      <br></br>
    </div>
  );
};
