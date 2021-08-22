import 'bootstrap/dist/css/bootstrap.css'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'

function Header() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark"
        sticky="top" expand="sm" collapseOnSelect>
         

        <Navbar.Toggle className="coloring" />
        <Navbar.Collapse>
          <Nav>
             
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="links">Links</Nav.Link>
            <Nav.Link href="#contact-us">Contact Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>

      </Navbar>
      <div className="content">
         
      </div>
    </div>
  );
}

export default Header;