
import React, { useState } from 'react';
import {DropdownButton, Dropdown, Col, Spinner, CardDeck, Alert, Navbar, Form, FormControl, Button, Nav} from 'react-bootstrap'
import {Deconnection} from './Deconnection'
import {getCookie, deleteCookie, upperCaseFirst} from '../util/util';

export function Header(props) {
  console.log(props)
    return (
      <>
      <Navbar bg="light" variant="light" style={{height: 64}}>
        <Navbar.Brand onClick={() => props.data.history.push("/")}>CO'Work Admin</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link>{props.data.location.pathname === "/" ? "Utilisateurs" : upperCaseFirst(props.data.location.pathname.replace("/", "").toLowerCase())}</Nav.Link>
        </Nav>
        <DropdownButton variant="light" id="dropdown-item-button" title={upperCaseFirst(getCookie("firstname").toLowerCase())} className="person-circle" alignRight>
            <Dropdown.Item as="button" onClick={() => props.data.history.push("/profil")}>Profil</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => Deconnection(props.data.setConnected)}>Déconection</Dropdown.Item>
          </DropdownButton>
      </Navbar>
      </>
    );
  }