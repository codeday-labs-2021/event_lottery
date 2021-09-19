import React, { useState } from "react";
import { Form, Col, Button,FormGroup, Container} from "react-bootstrap";
import Card from "react-bootstrap/Card";
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
      <>
      <br></br> 
    <div className="d-flex justify-content-center ">
       <Card   className="text-center" bg='Primary' border="primary" style={{ width: '28rem',padding:'3rem' }}> 
       <Card.Header className="text-center" as="h2">SignUP</Card.Header>
       <br></br>
       <div class="col-md-12">
        <Form className="form" onSubmit={handleSubmit}>
        
          
          <FormGroup>
          <Form.Label  >Enter Username</Form.Label>
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
          <Form.Label  >Enter Email</Form.Label>
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
          <Form.Label  >Enter Password</Form.Label>
            <Form.Control
              required
              type="password"
              name="password"
              value={userinput.password}
              onChange={handleFieldChange}
              placeholder="********"
            />
          </FormGroup>
          <br></br>
          <div className="text-center"> 
        <Button className="subutton" type="submit" size="large">Signup</Button>
         </div>
      </Form>
      
      </div> 
      </Card> 
    </div>
    </>
    );
}

export default SignUp;