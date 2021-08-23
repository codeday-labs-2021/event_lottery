import React, { useState,useEffect } from "react";
import { Button,Table } from "react-bootstrap";
import axios from 'axios'
import { useParams } from "react-router-dom";
import {  Col } from "react-bootstrap";
//import { data } from "jquery";
const Vistors = () => {

     


const[usage,setUsage]=useState([]);
const { urlid } = useParams();

useEffect(() => {
    const config = {
      url: `http://localhost:8080/stats/${urlid}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
       
    };
    console.log(urlid)
    axios(config).then((response) => {
      setUsage(response.data);
      console.log(response.data)
    }).catch((err) => {
      console.log(err)
    }) ;
  }, []);

    return(
        <>
        <div>
      <br></br>
      <div className="d-flex justify-content-center" >
          {usage!=null?(
        <ul class="list-group" as={Col} xs="2">
          <li class="list-group-item list-group-item-dark">Vistors</li>
          {usage.map(row => {
            return <li class="list-group-item">

              <li class="list-group-item" width={"10%"}> IP:{row.IpAddress} {""}  {""}Agent:{row.UserAgent}</li>
            </li>
          })}

        </ul>
        ):`link have not been used`}
      </div>
      </div>

        </>


    );
}
export default Vistors;