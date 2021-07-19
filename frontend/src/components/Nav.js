import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import axios from "axios";
axios.defaults.withCredentials = true
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

export const NavBar = ({ username, setUsername }) => {
  let menu;
  const logout = () => {
    axios
      .post(`${baseURL}/api/v1/logout`)
      .then((response) => {
        console.log(response.data);
        setUsername('');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (username === '') {
    menu = (
      <Navbar.Collapse className="justify-content-end">
      <Nav.Link href="/signin">Sign In</Nav.Link>
      <Nav.Link href="/signup">Sign Up</Nav.Link>
    </Navbar.Collapse>
    )
  } else {
    menu = (
      <Navbar.Collapse className="justify-content-end">
      <Navbar.Text>
        Logout of : <a href="/signin" onClick={logout}>{username}</a>
      </Navbar.Text>
    </Navbar.Collapse>
    )
  }
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Event Lottery</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
      <Nav.Link href="/">Home</Nav.Link>
      <Nav.Link href="/create">Create</Nav.Link>
      <Nav.Link href="/events">Events</Nav.Link>
      </Nav>
      {menu}
    </Navbar.Collapse>

      </Container>
    </Navbar>
    // <Nav defaultActiveKey="/home" as="ul">
    //   <Nav.Item as="li">
    //     <Nav.Link href="/">Home</Nav.Link>
    //   </Nav.Item>
    //   <Nav.Item as="li">
    //     <Nav.Link href="/create">Create</Nav.Link>
    //   </Nav.Item>
    //   <Nav.Item as="li">
    //     <Nav.Link href="/events">Events</Nav.Link>
    //   </Nav.Item>
    //   <Nav.Item as="li">
    //     <Nav.Link href="/signup">Signup</Nav.Link>
    //   </Nav.Item>
    //   <Nav.Item as="li">
    //     <Nav.Link href="/signin">SignIn</Nav.Link>
    //   </Nav.Item>
    // </Nav>
  );
};
