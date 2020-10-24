import React, { useState, useEffect } from 'react';
import {setCookie, getCookie} from '../util/util';
import {Container, Row, Col, Spinner, CardDeck, Alert, Navbar, Form, FormControl, Button} from 'react-bootstrap'
import axios from 'axios'

export function Profil(props) {
      const[firstname, setFirstname] = useState(getCookie("firstname"))
      const[lastname, setLastname] = useState(getCookie("lastname"))
      const[date_naissance, setDate_naissance] = useState(getCookie("date_naissance"))
      const[email, setEmail] = useState(getCookie("email"))
      const[pwd, setPwd] = useState(getCookie("pwd"))
    
      const handleFirstname = (event) => {
        
        setFirstname(event.target.value)
      }
      const handleLastname = (event) => {
        
        setLastname(event.target.value)
      }
      const handleDate_naissance = (event) => {
        
        setDate_naissance(event.target.value)
      }
      const handleEmail = (event) => {
        
        setEmail(event.target.value)
      }
      const handlePwd = (event) => {
        
        setPwd(event.target.value)
      }

      const user = {firstname: getCookie("firstname"), lastname: getCookie("lastname"), date_naissance: getCookie("date_naissance"), email: getCookie("email"), pwd: getCookie("pwd")}
      return (
          <Form>
              <Form.Group controlId="nom">
                <Form.Label className="float-left">Nom:</Form.Label>
                <Form.Control type="text" defaultValue={getCookie("lastname")} onKeyUp={handleLastname.bind(this)} required/>
              </Form.Group>
              <Form.Group controlId="prenom">
                <Form.Label className="float-left">Prenom</Form.Label>
                <Form.Control type="text" defaultValue={getCookie("firstname")} onKeyUp={handleFirstname.bind(this)} required/>
              </Form.Group>
              <Form.Group controlId="prenom">
                <Form.Label className="float-left">Date de naissance</Form.Label>
                <Form.Control type="date" defaultValue={getCookie("date_naissance")} onKeyUp={handleDate_naissance.bind(this)} onChange={handleDate_naissance.bind(this)} required/>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label className="float-left">Email</Form.Label>
                <Form.Control type="email" defaultValue={getCookie("email")} onKeyUp={handleEmail.bind(this)} required/>
              </Form.Group>
              <Form.Group controlId="pwd">
                <Form.Label className="float-left">Mot de passe</Form.Label>
                <Form.Control type="password" defaultValue={getCookie("firstname")} onKeyUp={handlePwd.bind(this)} required/>
              </Form.Group>
              {props.data.successModification !== null && <div className="text-center"><Alert className="mb-0" variant={props.data.successModification ? "success" : "danger"}>
              {props.data.successModification ? "Modification effectuée(s)" : "La modification a échoué"}
              </Alert></div>}
              <div className="text-center pt-3">
                <Button disabled={JSON.stringify({firstname, lastname, date_naissance, email, pwd}) === JSON.stringify(user)} className="mb-3" variant="primary" onClick={() => submitModification({firstname, lastname, date_naissance, email, pwd}, props.data.handleSuccessModification, getCookie("id"), props.data.handleRefresh)}>
                  Modifier
                </Button>
              </div>
            </Form>
      )
  }

  function submitModification(user, handleSuccessModification, id, handleRefresh) {
    let formData = new FormData();
    let userUpdate = {}
    for (const k in user) {
        if(user[k].trim() !== "") {
            console.log(user[k])
            userUpdate[k] = user[k]
            formData.append(k, user[k]);
        }
    }
    fetch('https://cowork-paris.000webhostapp.com/index.php/user/update/'+id,
        {
            body: formData,
            method: "post"
        })
        .then(res=>res.json())
        .then(res => {
            if(res[0] === "User updated successfully.") {
                for (const key in userUpdate) {
                    setCookie(key, userUpdate[key], 1)
                 }
                 handleSuccessModification(Date.now())
            } else {
                handleSuccessModification(false)
            }
        })
        .catch(e => {
            handleSuccessModification(false)
        })
  }
