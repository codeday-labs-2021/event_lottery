import React, { useState } from "react";
import { Form, Col, Button,FormGroup } from "react-bootstrap";

import axios from 'axios'
import { useHistory } from "react-router-dom";


export default function Logout({setId}) {

    const history = useHistory();

    const logoutHandler = e => {
        e.preventDefault();
      const requestConfig={
        url:'/signout',
        method:'post',
        header:{'Content-Type': 'application/jason'},
      };
      axios(requestConfig)
      .then((response)=>{
        console.log(response);
        history.push("/signin");
        setId("")
      })
       .catch((err)=>{
         console.log(err);
       });
    
      }
     
    return (
      <>
        <button
         class="btn btn-danger"
          variant="outlined"
          color="inherit"
          onClick={logoutHandler}
        >
          Log Out
        </button>
      </>
    );
  }