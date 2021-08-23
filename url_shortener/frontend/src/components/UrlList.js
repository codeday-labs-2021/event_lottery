import React, { useState,useEffect } from "react";
import { Button,Table } from "react-bootstrap";
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
        <div className="d-flex justify-content-center">
       
      <Table class="table table-striped" >
        <thead>
          <tr>
             
            <th scope="col">Long url</th>
            <th scope="col">Short url</th>
            <th scope='col'>view</th>
          </tr>
        </thead>
        <tbody>
        {url &&
            url.map((row) => {
              return (
                <tr>
                 
                  <td>{row.longUrl}</td>
                  <td>{row.shortUrl}
                   
                  </td>
                  <td> <Button
                      onClick={() => history.push(`/links/${row.ID}`)}
                      variant="info"
                    >
                      view usage
                    </Button></td>
                  
                </tr>
              
              );
            })}
        </tbody>
      </Table>
      </div>
      
        
</>

    );
}
export default UrlList;