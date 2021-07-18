import React, { useState } from "react";
import { Form, Col, Button,FormGroup} from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";
const baseURL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_API;
export const SignUp = () => {

  const[userinput, setUserInput]=useState({
    username:"",
    email:"",
    password:""
  })

     

    const handleFieldChange = e => {
      const {name,value}=e.target;
      setUserInput({
        ...userinput,
        [name]:value,
        
      });
    }

    const handleSubmit = e => {
      e.preventDefault();
     
    const requestConfig={
      url:`${baseURL}/api/v1/signup`,
      method:'post',
      header:{'Content-Type': 'application/jason'},
      data:{
        username:userinput.username,
        email:userinput.email,
        password:userinput.password,
      },
    };
    axios(requestConfig)
    .then((response)=>{
      console.log(response);
    })
     .catch((err)=>{
       console.log(`${err}`);
     });

    }


    return (  
    <div className="signup-app">
         
        <Form className="form" onSubmit={handleSubmit}>
        <h2 className="signup-title">SignUp</h2>
          <FormGroup>
          <Form.Label>Enter Username</Form.Label>
            <Form.Control
              required
              type="username"
              name="username"
              value={userinput.username}
              onChange={handleFieldChange}
              placeholder="Exname"
            />
          </FormGroup>
          <FormGroup>
          <Form.Label>Enter Email</Form.Label>
            <Form.Control
              required
              type="email"
              name="email"
              value={userinput.email}
              onChange={handleFieldChange}
              placeholder="example@example.com"
            />
          </FormGroup>
          <FormGroup>
          <Form.Label>Enter Password</Form.Label>
            <Form.Control
              required
              type="password"
              name="password"
              value={userinput.password}
              onChange={handleFieldChange}
              placeholder="********"
            />
          </FormGroup>
        <Button className="subutton">Signup</Button>
      </Form>
    </div>
    );
}