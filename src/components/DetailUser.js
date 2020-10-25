import React, { useState, useEffect } from 'react';
import {Table, Form, FormControl, Button, Spinner, Row, Col, Alert, Tabs, Tab, Accordion, Card, ListGroup, ListGroupItem} from 'react-bootstrap'
import axios from 'axios'
import {useLocation, useHistory} from "react-router-dom";
import {upperCaseFirst, setCookie, RealName, endAbonnementToString, formatStringToDate} from '../util/util';
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment';

export function DetailUser(props) {
    const[user, setUser] = useState(null)
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        if(!location.state || !location.state.id) history.push("/utilisateurs")
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/'+location.state.id).then(res => setUser(res.data)).catch(err => history.push("/utilisateurs"))
     }, [location])

    return (
        <>
            {user &&
            <>
                <div className="pb-4"><h3>{upperCaseFirst(user.firstname.toLowerCase()) + " " + upperCaseFirst(user.lastname.toLowerCase())}<Button className="float-right" variant="danger" disabled={user.admin === "true"}>Supprimer</Button></h3><hr/></div>
                <div className="pb-2"><h5>Informations et réservations</h5></div>
                <CustomerReservations data={{idUser: location.state.id, user}}/>
            </>
            }
        </>
    )
}

function CustomerReservations(props) {
    const [privative, setPrivative] = useState([])
  
    const [equipment, setEquipment] = useState([])
  
    const [meal, setMeal] = useState([])
  
    const [events, setEvents] = useState([])
    const [infos, setInfos] = useState([])
  
    const [activeTab, setActiveTab] = useState("infos")
  
    const [isLoading, setIsLoading] = useState({privative: true, equipment: true, meal: true, events: true, infos: true})
    const [isDeleted, setIsDeleted] = useState(null)
  
    const handleSelect = (tab) => {
      switch(tab) {
        case "privative" :
          setIsLoading({...isLoading, equipment: true, meal: true, events: true, infos: true})
          break;
        case "equipment" :
          setIsLoading({...isLoading, privative: true, meal: true, events: true, infos: true})
          break;
        case 'meal' :
          setIsLoading({...isLoading, privative: true, equipment: true, events: true, infos: true})
          break;
        case 'events' :
          setIsLoading({...isLoading, privative: true, equipment: true, meal: true, infos: true})
          break;
        case 'infos' :
            setIsLoading({...isLoading, privative: true, equipment: true, meal: true, events: true})
      }
      setActiveTab(tab)
    }
  
    useEffect(() => {
      if(activeTab === "privative") {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/privative/'+props.data.idUser)
        .then(res => {
            console.log(res.data)
            setIsLoading({...isLoading, privative: false})
            setPrivative(res.data)
        })
        .catch(e => setIsLoading({...isLoading, privative: false}))
      }
      if(activeTab === "equipment") {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/equipment/'+props.data.idUser)
        .then(res => {
          setIsLoading({...isLoading, equipment: false})
            setEquipment(res.data)
        })
        .catch(e => setIsLoading({...isLoading, equipment: false}))
      }
      if(activeTab === "meal") {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/meal/'+props.data.idUser)
        .then(res => {
          setIsLoading({...isLoading, meal: false})
            setMeal(res.data)
        })
        .catch(e => setIsLoading({...isLoading, meal: false}))
      }
      if(activeTab === "events") {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/events/'+props.data.idUser)
        .then(res => {
          setIsLoading({...isLoading, events: false})
            setEvents(res.data)
        })
        .catch(e => setIsLoading({...isLoading, events: false}))
      }
      if(activeTab === "infos") {
        console.log(props.data.user)
        setInfos([props.data.user])
        setIsLoading({...isLoading, infos: false})
      }
    }, [activeTab, isDeleted]);
  
    return (
    <Row>
        <Col lg="6">
            <Tabs defaultActiveKey="infos" id="uncontrolled-tab-example" onSelect={(e) => handleSelect(e)}>
                <Tab eventKey="infos" title="Infos" name="infos">
                    <Row>
                        <Col lg="12" className="pt-3">
                        {activeTab === "infos" && isDeleted !== null && <Alert variant={isDeleted ? "success" : "danger"}>
                        {isDeleted ? "Réservation annulée" : "Echec de l'annulation"}
                        </Alert>}
                        {isLoading.infos && <div className="text-center"><Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        variant="primary"
                        role="status"
                        aria-hidden="true"
                        style={{width: "5em", height: "5em"}}
                        /></div>}
                        {!isLoading.infos && activeTab === "infos" && <ListInfosUser data={{data: infos, setIsDeleted, type: "user"}}/>}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="privative" title="Espaces privatifs" name="privative">
                    <Row>
                        <Col lg="12" className="pt-3">
                        {activeTab === "privative" && isDeleted !== null && <Alert variant={isDeleted ? "success" : "danger"}>
                        {isDeleted ? "Réservation annulée" : "Echec de l'annulation"}
                        </Alert>}
                        {isLoading.privative && <div className="text-center"><Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        variant="primary"
                        role="status"
                        aria-hidden="true"
                        style={{width: "5em", height: "5em"}}
                        /></div>}
                        {!isLoading.privative && activeTab === "privative" && <ListReservations data={{data: privative, setIsDeleted, type: "privative"}}/>}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="equipment" title="Matériel" name="equipment">
                    <Row>
                        <Col lg="12" className="pt-3">
                        {activeTab === "equipment" && isDeleted !== null && <Alert variant={isDeleted ? "success" : "danger"}>
                        {isDeleted ? "Réservation annulée" : "Echec de l'annulation"}
                        </Alert>}
                        {isLoading.equipment && <div className="text-center"><Spinner
                            as="span"
                            animation="border"
                            variant="primary"
                            role="status"
                            aria-hidden="true"
                            stye={{width: "5em", height: "5em"}}
                            /></div>}
                        {!isLoading.equipment && activeTab === "equipment" && <ListReservations data={{data: equipment, setIsDeleted, type: "equipment"}}/>}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="meal" title="Plateaux repas" name="meal">
                    <Row>
                        <Col lg="12" className="pt-3">
                        {activeTab === "meal" && isDeleted !== null && <Alert variant={isDeleted ? "success" : "danger"}>
                        {isDeleted ? "Réservation annulée" : "Echec de l'annulation"}
                        </Alert>}
                        {isLoading.meal && <div className="text-center"><Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            variant="primary"
                            role="status"
                            aria-hidden="true"
                            style={{width: "5em", height: "5em"}}
                            /></div>}
                        {!isLoading.meal && activeTab === "meal" && <ListReservations data={{data: meal, setIsDeleted, type: "meal"}}/>}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="events" title="Evenements" name="events">
                    <Row>
                        <Col lg="12" className="pt-3">
                        {activeTab === "events" && isDeleted !== null && <Alert variant={isDeleted ? "success" : "danger"}>
                        {isDeleted ? "Réservation annulée" : "Echec de l'annulation"}
                        </Alert>}
                        {isLoading.events && <div className="text-center"><Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            variant="primary"
                            role="status"
                            aria-hidden="true"
                            style={{width: "5em", height: "5em"}}
                            /></div>}
                        {!isLoading.events && activeTab === "events" && <ListReservations data={{data: events, setIsDeleted, type: "events"}}/>}
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </Col>
    </Row>
    )
  }

  function Annuler(id, setIsDeleted, type) {
    let uri = ""
    if(type === "privative") uri = "ReservationPrivateSpace/delete/"
    else if (type === "equipment") uri = "ReservationEquipment/delete/"
    else if (type === "meal") uri = "ReservationMeal/delete/"
    else if (type === "events") uri = "ReservationEvents/delete/"
  
    axios.get("https://cowork-paris.000webhostapp.com/index.php/"+uri+id).then(res => setIsDeleted(true)).catch(err => setIsDeleted(false))
  }

  function ListReservations(props) {
    return (
      <Accordion defaultActiveKey="0">
        {props.data.data.map(v => <DetailsReservation key={v.id} data={{data: v, type: props.data.type, setIsDeleted: props.data.setIsDeleted}}/>)}
      </Accordion>
    )
  }

function DetailsReservation(props) {
    const[details, setDetails] = useState(null)
    const[isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let uri, field;
        props.data.type === "privative" ? uri = "PrivativeSpace" : uri = props.data.type

        if(props.data.type === "privative") field = "id_espace_privatif"
        else if (props.data.type === "equipment") field = "id_equipment"
        else if (props.data.type === "meal") field = "id_meal"
        else if (props.data.type === "events") field = "id_events"

        axios.get('https://cowork-paris.000webhostapp.com/index.php/'+uri +'/'+props.data.data[field]).then(res => {
            setDetails(res.data)
            setIsLoading(false)
        }).catch(err => {
            setDetails(null)
            setIsLoading(false)
        })
    }, [props.data.data.length > 0 && props.data.data[0].id])

    return (
        <>
        {<Card>
          <Card.Header>
          <Button variant="danger" className="float-right" onClick={() => Annuler(props.data.data.id, props.data.setIsDeleted, props.data.type)}>Annuler</Button>
            <Accordion.Toggle as={Button} variant="link" eventKey={props.data.data.id}>
                {isLoading && ["danger","warning","success"].map((s,i) => <Spinner key={i} animation="grow" as="span" size="sm" variant={s} role="status" aria-hidden="true"/>)}
                {!isLoading && details && details.nom + " | "}
                {(formatStringToDate(props.data.data.horaire_debut || props.data.data.horaire || props.data.data.id))}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={props.data.data.id}>
            <Card.Body>
                {Object.keys(props.data.data).filter(k => k !== "id" && k !== "id_user").map((key,i) => {
                    let res
                    let val
                    if(key.includes("horaire")) val = formatStringToDate(props.data.data[key])
                    else if(key === "id_espace_privatif" || key === "id_equipment" || key === "id_meal" || key === "id_events") {
                        if(isLoading) val = false
                        else val = details.nom
                    }
                    else val = props.data.data[key]
                    if(val) return <p key={i}>{RealName(props.data.type, key)+": "+val}</p>
                    else return ["danger","warning","success"].map((s,j) => <Spinner key={i+j} animation="grow" as="span" size="sm" variant={s} role="status" aria-hidden="true"/>)
                })}
            </Card.Body>
          </Accordion.Collapse>
        </Card>}
        </>
    )
}

  function ListInfosUser(props) {
    const[abonnement, setAbonnement] = useState(null)
    const[resAbonnement, setResAbonnement] = useState(null)
      
    useEffect(() => {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/abonnement/'+ props.data.data[0].id).then(res => {
            let tmpA = null
            if(res.data.length === 0 || (res.data.length > 0 && res.data[0].id_abonnement === "0")) tmpA = "not_sub"
            else tmpA = res.data[0]
            setResAbonnement(res.data[0])
            if(tmpA !== "not_sub") {
                axios.get('https://cowork-paris.000webhostapp.com/index.php/abonnement/'+ tmpA.id_abonnement).then(resA => setAbonnement(resA.data)).catch(err => setAbonnement("not_sub"))
            } else setAbonnement(tmpA)
        }).catch(err => setAbonnement("not_sub"))
    }, [props.data.data[0].id])

    return (
    <>
    {!abonnement && <div className="text-center"><Spinner
    as="span"
    animation="border"
    size="sm"
    variant="primary"
    role="status"
    aria-hidden="true"
    style={{width: "5em", height: "5em"}}
    /></div>}
    {abonnement && <ListGroup as="ul">
    {props.data.data.map((v,i) => Object.keys(v).filter(l => l !== "id" && l !== "pwd").map(l =>{
        return (<ListGroup.Item key={l} as="li">
        {l !== "admin" ? <p>{RealName(props.data.type, l)+": "+v[l]}</p> : (v[l] === "true" ? <p>{RealName(props.data.type, l) + ": " + "Oui"}</p> : <p>{RealName(props.data.type, l) + ": " + "Non"}</p>)}
        </ListGroup.Item>)
    }))}
    <ListGroupItem key={17} as="li">
        <h5>Abonnement</h5>
        {abonnement !== "not_sub" && Object.keys(abonnement).filter(a => a !== "id").map((a,i) => <p key={i}>{ RealName(props.data.type, a) + ": " + abonnement[a]}</p>)}
        {abonnement !== "not_sub" && <p>{endAbonnementToString(resAbonnement.id_abonnement, resAbonnement.created_at)}</p>}
        {abonnement === "not_sub" && <p>Aucun abonnement en cours</p>}
    </ListGroupItem>
    </ListGroup>}
    </>
    )
  }