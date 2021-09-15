import React, { useState } from "react";
import { Form, Col, Button,FormGroup } from "react-bootstrap";
import LoginSignup from "./LoginSignup";
import Logout from "./SignOut"
import {Link } from "react-router-dom";
export default function AuthButtons({id,setId}){
     
    if (id !=0) {
      return <Logout  id={id} setId={setId}/>;
     }else{
      return <LoginSignup />;
     }
  };