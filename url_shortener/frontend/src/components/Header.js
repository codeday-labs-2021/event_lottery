import 'bootstrap/dist/css/bootstrap.css'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'

function Header() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark"
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
        <Nav.Link href="/signup">Sign Up</Nav.Link>
        <Nav.Link href="/signin">Sign In</Nav.Link>
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