import React, { useState, useEffect } from 'react';
import {Table, Form, FormControl, Button, Spinner, Row, Col, Container, Alert} from 'react-bootstrap'
import axios from 'axios'
import {useLocation} from "react-router-dom";
import {Connection} from './Connection'
import md5 from 'crypto-js/md5';

export function Login(props) {
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [success, setSuccess] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
  
    const handleEmail = (event) => {
      setEmail(event.target.value)
    }
  
    const handlePwd = (event) => {
      setPwd(event.target.value)
    }

    useEffect(() => {
        console.log(success)
     }, []);

    return (
        <div style={styleVcenter}> 
        
        <Container className="vertical-center">
            <Row className="h-100" style={{marginLeft: "6em", marginRight: "6em"}}>
                <Col className="my-auto">
                    <div className="text-center pb-5">
                        <h1 className="display-2">CO'Work Admin</h1>
                    </div>
                <Form>
                    <Form.Group controlId="formBasicEmail" className="pb-4 mb-4">
                        <Form.Control type="email" placeholder="Email" size="lg" onKeyUp={(e) => handleEmail(e)}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Mot de passe" size="lg" onKeyUp={(e) => handlePwd(e)}/>
                    </Form.Group>
                    {success !== null && !success && <div className="text-center pt-3"><Alert className="mb-0" variant={success ? "success" : "danger"}>
                    {"L'authentification a échoué"}
                    </Alert></div>}
                    <div className="text-center pt-4">
                        <Button className="mb-3" variant="primary" onClick={() => {Connection(email, pwd, setIsLoading, setSuccess, props.data.history, props.data.setConnected, success)}} disabled={email.trim() === "" || pwd.trim() === ""}>
                            {isLoading && <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="pr-2"
                            />}
                            {!isLoading && "Connection"}
                        </Button>
                    </div>
                </Form>
                </Col>
            </Row>
        </Container>
        </div>
    )

}

const styleVcenter = {
    minHeight: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center;"
  }