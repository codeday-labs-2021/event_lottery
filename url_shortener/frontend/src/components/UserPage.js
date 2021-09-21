import { Button, Container,ListGroup,Table,Jumbotron} from 'react-bootstrap'
import axios from 'axios'
import { useState,useEffect } from 'react';
import { useHistory } from "react-router-dom";
 
//import {  useHistory } from 'react-router-dom';

export default function UserPage({id,usernme}) {
    const history=useHistory();
const [urls, setUrls]=useState([])
    const data = async () => {
        const urldata = await axios.get(`/userurls/${id}`);
         console.log(urldata.data)
         setUrls(urldata.data)
    }
    useEffect(() => {
        data();
         
      }, []);

    return (
        <>
        <br></br>
        {usernme!=""?( 
        <Container> 
        <h3>Hello {usernme} this is all the urls you have Created</h3>
        <br></br>
        <Table striped bordered hover>
  <thead>
    <tr>
      <th>#</th>
      <th>logurl</th>
      <th>shorturl</th>
      <th>view stats</th>
    </tr>
  </thead>
  <tbody>
  {urls &&
            urls.map((row) => {
              return (
    <tr>
      <td>{row.ID}</td>
      <td>{row.longUrl}</td>
      <td>{row.shortUrl}</td>
      <td><Button
                      onClick={() => history.push(`/mylinks/${row.ID}`)}
                      variant="info"
                    >
                      view usage
                    </Button>
        </td>
       
    </tr>
     
       
     
     
       
              )})}
  </tbody>
</Table>
</Container>
        ):
        <div className="d-flex justify-content-center">
            <h3> You dont have an account Creat one</h3>
        </div>
}
        </>
    )


}


//<td colSpan="2">Larry the Bird</td>