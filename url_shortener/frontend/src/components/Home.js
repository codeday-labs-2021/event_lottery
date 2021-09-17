import React, { useState } from "react";
import { Form, Col, Row, Button, FormGroup } from "react-bootstrap";
import axios from 'axios'
import NewUrl from "./NewUrl";
const Home = ({ username, id }) => {
  const [url, seturl] = useState("")
  const [input, setInput] = useState({
    longurl: "",
    userid :id.toString()
  })
  const handleChanges = (event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,


    });
    console.log(value)
  }
  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post("/register", input)
      .then((response) => {
        console.log(response);
        if (response != null) {

          seturl(response.data)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="d-flex justify-content-center text-center">
       
        <div class="col-md-6">
            <br></br>
            <br></br>
            <h1>URL Shortner</h1>
            <Form className="form" xs={5} onSubmit={handleSubmit}>


              <FormGroup controlId="formGridurl"  >
                <Form.Label className="text-center">Enter URL</Form.Label>
                <Form.Control

                  required
                  name="longurl"
                  value={input.longurl}
                  onChange={handleChanges}
                  placeholder="Inter Url"
                  //size="md"
                />
              </FormGroup>
              <br></br>
              <div className="d-flex justify-content-around">
                <Button className="subutton" type="submit">Shorten</Button>
              </div>
            </Form>
            <br></br>
            <NewUrl urlres={url} />
        </div>

        

      </div>
   

  );
}
export default Home;
