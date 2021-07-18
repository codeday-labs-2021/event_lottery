import React, { useState } from "react";
import { Form, Col, Button,FormGroup } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";
const baseURL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_API;
export const SignIn = () => {

  const[input, setInput]=useState({
    email:"",
    password:""
  })
  const handleChanges=(event)=>{
    const {name,value}=event.target;
    setInput({
      ...input,
      [name]:value,
      
    });
  }
    const handleSubmit = e => {
      e.preventDefault();
     
    const requestConfig={
      url:`${baseURL}/api/v1/singnin`,
      method:'post',
      header:{'Content-Type': 'application/jason'},
      data:{
        email:input.email,
        password:input.password,
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
    <div className="App"  as={Col} xs="2">
         
        <Form className="form" onSubmit={handleSubmit}>
        <h2 className="title">SignIn</h2>
          <FormGroup>
          <Form.Label>Enter Email</Form.Label>
            <Form.Control
              required
              type="email"
              name="email"
              value={input.email}
              onChange={handleChanges}
              placeholder="example@example.com"
            />
          </FormGroup>
          <FormGroup>
          <Form.Label>Phone Password</Form.Label>
            <Form.Control
             required
              type="password"
              name="password"
              value={input.password}
              onChange={handleChanges}
              placeholder="********"
            />
          </FormGroup>
        <Button className="subutton">Login</Button>
      </Form>
    </div>
  );
}