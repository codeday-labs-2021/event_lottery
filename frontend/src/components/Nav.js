import React from "react";
import {
  Nav,
  //   NavDropdown,
  //   Button,
  //   Form,
  //   FormControl,
} from "react-bootstrap";

export const NavBar = () => {
  return (
    <Nav defaultActiveKey="/home" as="ul">
      <Nav.Item as="li">
        <Nav.Link href="/">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link href="/create">Create</Nav.Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link href="/events">Events</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
