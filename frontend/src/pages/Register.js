import React,{useState} from "react";
import { Form,Button,Col } from "react-bootstrap";
export const Register = () => {

  const[input, setInput]=useState({
    fullname:"",
    phonenumber:""
  })
  const handleChanges=(event)=>{
    const {name,value}=event.target;
    setInput({
      ...input,
      [name]:value,
      
    });
     
  };
  const HandleSubmits=(event)=>{
    event.preventDefault();
    fetch('/api/v1/regester', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({
          fullname:input.fullname,
          phonenumber:input.phonenumber,

      })
  });
  }

  console.log(input)
  return (
    <div>
      <h1>Register Page</h1>
      <Form onSubmit={HandleSubmits}>
  <Form.Group as={Col} xs="6" controlId="formBasicEmail">
    <Form.Label>Full Name</Form.Label>
    <Form.Control type="Text" placeholder="Enter Fullname"
    name="fullname" 
    value={input.fullname}
    onChange={handleChanges}/>
     
  </Form.Group>

  <Form.Group as={Col} xs="6" controlId="formBasicPassword">
    <Form.Label>Enter Phone number</Form.Label>
    <Form.Control type="text" placeholder="Phone Number"
    name="phonenumber" 
    value={input.phonenumber}
    onChange={handleChanges}/>
  </Form.Group >
   
  <Button   xs="6" variant="primary" type="submit"  >
    Submit
  </Button>
</Form>
    </div>
  );
};
