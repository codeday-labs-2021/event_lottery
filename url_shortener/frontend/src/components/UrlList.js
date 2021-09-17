import React, { useState,useEffect } from "react";
import { Button,Table,Card,CardColumns } from "react-bootstrap";
import axios from 'axios'
//import { data } from "jquery";
import {  useHistory } from 'react-router-dom';
const UrlList = () => {
    const history = useHistory();
const[url,setUrl]=useState([]);
useEffect(() => {
    const config = {
      url: `http://localhost:8080/list`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    axios(config).then((response) => {
      setUrl(response.data);
      console.log(response.data)
    }).catch((err) => {
      console.log(err)
    }) ;
  }, []);

    return(
      <>
      <br></br>
      <h1 className="text-center">List of all Urls</h1>
      <br></br>
     <div className="d-flex justify-content-center "> 
      
      <CardColumns  >
      {url &&
         url.map((row) => {
           return (
<Card bg="secondary" text="light" border="dark"style={{ width: '55rem',marginBottom:'20px'}} >

 <Card.Body  >
  
   <Card.Title>Long Url</Card.Title>
   <Card.Text>
      {row.longUrl}
   </Card.Text>
   <Card.Title>Short Url</Card.Title>
     <Card.Text>
      {row.shortUrl}
     </Card.Text>
        
      
 </Card.Body>
   
</Card>
)})}
<br></br>
</CardColumns> 

</div>   
     
</>

    );
}
export default UrlList;