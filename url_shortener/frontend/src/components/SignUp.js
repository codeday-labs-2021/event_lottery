import React, { useState } from "react";
import { Form, Col, Button,FormGroup, Container} from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";
//import './SignUp.css'
export const SignUp = () => {
  const [success,setSuccess]=useState(false)
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
console.log(userinput)
    const handleSubmit = e => {
      e.preventDefault();
    const requestConfig={
      url:'/signup',
      method:'post',
      header:{'Content-Type': 'application/jason'},
      data:{
        username:userinput.username,
        email:userinput.email,
        password:userinput.password
      },
    };
    axios(requestConfig)
    .then((response)=>{
      console.log(response);
      setSuccess(true)
    })
     .catch((err)=>{
       console.log(err);
     });

    }

    if (success) {
      return <Redirect to="/signin" />;
    }
    return (  
    <div className="d-flex justify-content-center">
       
       <div class="col-md-5">
        <Form className="form" onSubmit={handleSubmit}>
        <h2 className="title">SignUp</h2>
          
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
        <Button className="subutton" type="submit">Signup</Button>
         
      </Form>
      
      </div>  
    </div>
    );
}

export default SignUp;