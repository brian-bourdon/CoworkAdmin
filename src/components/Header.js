
import React, { useState } from 'react';
import {Container, DropdownButton, Dropdown, Col, Spinner, CardDeck, Alert, Navbar, Form, FormControl, Button, Nav} from 'react-bootstrap'
import {Deconnection} from './Deconnection'
import {getCookie, deleteCookie, upperCaseFirst} from '../util/util';
import {useLocation, useHistory} from "react-router-dom";

export function Header(props) {
  const location = useLocation()
  const history = useHistory()

    return (
      <>
      <Container fluid className="pr-0 pl-0">
      <Navbar bg="light" variant="light" style={{height: 64}}>
        <Navbar.Brand onClick={() => history.push("/")}>CO'Work Admin</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link>{location.pathname === "/" ? "Utilisateurs" : upperCaseFirst(location.pathname.replace("/", "").toLowerCase())}</Nav.Link>
        </Nav>
        <DropdownButton variant="light" id="dropdown-item-button" title={upperCaseFirst(getCookie("firstname").toLowerCase())} className="person-circle" alignRight>
            <Dropdown.Item as="button" onClick={() => history.push("/profil")}>Profil</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => Deconnection(props.data.setConnected)}>Déconection</Dropdown.Item>
          </DropdownButton>
      </Navbar>
      </Container>
      </>
    );
  }