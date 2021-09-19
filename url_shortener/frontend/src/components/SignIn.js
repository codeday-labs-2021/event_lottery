import React, { useState } from "react";
import { Form, Col, Button,FormGroup, Card } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";

export const SignIn = ({setUsername,setId} ) => {
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
      // setId(response.data.Id)
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
      <> 
        <br></br> 
        <div className="d-flex justify-content-center ">
           <Card   className="text-center" bg='ligth' border="dark" style={{ width: '28rem',padding:'3rem' }}> 
           <Card.Header className="text-center" as="h2">LogIn</Card.Header>
           <br></br>
           <div class="col-md-12">

        <Form className="form" onSubmit={handleSubmit}>
        
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
          <br></br>
        <Button className="subutton" type="submit" size="lg">Login</Button>
      </Form>
    </div>
    </Card> 
    </div>
    </>
  );
} 

export default SignIn;