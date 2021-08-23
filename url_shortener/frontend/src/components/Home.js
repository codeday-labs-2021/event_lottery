import React, { useState } from "react";
import { Form, Col,Row, Button,FormGroup } from "react-bootstrap";
import axios from 'axios'
import NewUrl from "./NewUrl";
 const Home = () => {
    const [url, seturl]=useState("")
    const[input, setInput]=useState({
        longurl:"",    
      })
 const handleChanges=(event)=>{
        const {name,value}=event.target;
        setInput({
          ...input,
          [name]:value,
          
    
        });
        console.log(value)
 }
    const handleSubmit = e => {
        e.preventDefault();
        axios
          .post("http://localhost:8080/register", input)
          .then((response) => {
            console.log(response);
             if(response!=null){

            seturl(response.data)
          }
          })
          .catch((error) => {
            console.log(error);
          });
    }

  return (
      <di> 
     
      <div className="app" >
         
           
          <Row className="d-flex justify-content-center"> 
          <Col xs={6}  > 
          <br></br>
          <h1>URL Shortner</h1>
          <Form className="form" xs={9} onSubmit={handleSubmit}>
         
        
          <FormGroup   controlId="formGridurl">
          <Form.Label>Enter URL</Form.Label>
            <Form.Control
            
              required
              name="longurl"
              value={input.longurl}
              onChange={handleChanges}
              placeholder="Inter url"
            />
          </FormGroup>
          <br></br>
          <div className="d-flex justify-content-around">
        <Button className="subutton" type="submit">Shorten</Button>
        </div>
      </Form>
      <br></br>
      <NewUrl urlres={url}/>
      </Col>
       
      </Row>
       
        </div>
        </di>
       
  );
}
export default Home;
 