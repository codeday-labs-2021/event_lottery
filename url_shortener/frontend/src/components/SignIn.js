import React, { useState } from "react";
import { Form, Col, Button,FormGroup } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";

export const SignIn = ({setUsername} ) => {
  const [success,setSuccess]=useState(false)
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
      url:'/signin',
      
      method:'post',
       
      header:{'Content-Type': 'application/jason'},
       
      data:{
        email:input.email,
        password:input.password,
      },
    };
    axios(requestConfig,{withCredentials: false})
    .then((response)=>{
      console.log(response);
      setSuccess(true)
       
      setUsername(response.data.Username)
    })
     .catch((err)=>{
       console.log(err);
     });

    }

    if (success) {
      return <Redirect to="/" />;
    }

    return (  
        <div className="d-flex justify-content-center">
       
        <div class="col-md-5">

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
        <Button className="subutton" type="submit">Login</Button>
      </Form>
    </div>
    </div>
  );
} 

export default SignIn;