import React, { useState } from "react";
import { Form, Col,Row, Button,FormGroup } from "react-bootstrap";
 const Home = () => {

    const[input, setInput]=useState({
        longurl:"",
         
      })
 const handleChanges=(event)=>{
        const {name,value}=event.target;
        setInput({
          ...input,
          [name]:value,
    
        });
 }
    const handleSubmit = e => {
        console.log(e)
    }

  return (
      <di> 
     
      <div className="app" >
         
           
          <Row className="d-flex justify-content-center"> 
          <Col xs={6}  > 
          <h1>Order Your Pizza</h1>
          <Form className="form" xs={9}onSubmit={handleSubmit}>
        <h2 className="title">SignIn</h2>
        
          <FormGroup   controlId="formGridEventName">
          <Form.Label>Enter Email</Form.Label>
            <Form.Control
            
              required
              name="url"
              value={input.longurl}
              onChange={handleChanges}
              placeholder="Inter url"
            />
          </FormGroup>
          <div className="d-flex justify-content-around">
        <Button className="subutton">Shorten</Button>
        </div>
      </Form>
      </Col>
      </Row>
        </div>
        </di>
       
  );
}
export default Home;
 