import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'
import {Link } from "react-router-dom";
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import AuthButtons from './Aouth/AuthButtons';
function Header({id,setId}) {
   

   

   
  return (
    <div className="App">
      <Navbar class="navbar navbar-dark " bg="light" variant="light" 
        sticky="top" expand="lg" collapseOnSelect>
         
      <Container>
        <Navbar.Toggle className="coloring" />
        <Navbar.Collapse>
          <Nav>
             
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="links">Links</Nav.Link>
            <Nav.Link href="#contact-us">Contact Us</Nav.Link>
             
          </Nav>
          
          <Navbar.Collapse className="justify-content-end">
              
          <AuthButtons id={id} setId={setId}/>
          
         
      </Navbar.Collapse>
       
        </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="content">
         
      </div>
    </div>
  );
}

export default Header;