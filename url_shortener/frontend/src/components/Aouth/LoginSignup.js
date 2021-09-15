import React, { useState } from "react";
import { Form, Col, Button,FormGroup } from "react-bootstrap";
import {Link } from "react-router-dom";

export default function LoginSignup() {
     
    return (
      <div  class="d-grid gap-2 d-md-flex  "> 
      <Link to="/signin"> 
        <button
          class="btn btn-info"
          variant="outlined"
          color="inherited"
          type="button"
         // onClick={() => loginWithRedirect()}
        >
          Log In
        </button>  
     </Link>

        <Link to="/signup"> 
        <button
         class="btn btn-info"
          variant="outlined"
          color="inherited"
          type="button"
           
        >
          Sign Up
        </button>
        </Link>
      </div>
    );
  }