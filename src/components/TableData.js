import React, { useState, useEffect } from 'react';
import {Table, Form, FormControl, Button, Spinner, Row, Col, Alert} from 'react-bootstrap'
import axios from 'axios'
import {useLocation, useHistory} from "react-router-dom";
import {upperCaseFirst, setCookie, RealName} from '../util/util';
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import getHours from 'date-fns/setMinutes'
import moment from 'moment';
import {fr} from "date-fns/locale";
import md5 from 'crypto-js/md5';

export function TableData(props) {
    const[data, setData] = useState([])
    const[filterData, setFilterData] = useState([])
    const[isLoading, setIsloading] = useState(props.data.load)
    const[uri, setUri] = useState(null)
    const[schema, setSchema] = useState([])
    const[successModification, setSuccessModification] = useState(null)
    const[add, setAdd] = useState(false)
    const[formAdd, setFormAdd] = useState({})
    const[successAdd, setSuccessAdd] = useState(null)
    const[path, setPath] = useState(useLocation().pathname)
    const[space, setSpace] = useState(null)
    const[isLoadingSpace, setIsloadingSpace] = useState(true)
    const[users, setUsers] = useState(null)
    const[isLoadingUsers, setIsloadingUsers] = useState(true)

    const handleFormAdd = (key, e) => {
        let val
        if(e.target === undefined) val = e
        else val = e.target.value
        let tmp = {...formAdd}
        if(key === "pwd") val = md5(val).toString()
        tmp[key] = val
        setFormAdd(tmp)
    }

    const handleSuccessModification = (v) => {
        setSuccessModification(v)
    }

    const handleSuccessAdd = (v) => {
        setSuccessAdd(v)
    }

    const handleSearch = (k, e) => {
        
        let regex = new RegExp( e.target.value.toLowerCase(), 'g');
        let filter
        let field
        console.log(data)
        const tabSelect = ["ReservationPrivateSpace", "ReservationEquipment", "ReservationEvents", "Ticket", "ReservationMeal"]
        if(e.target.value !== "") {
            if(tabSelect.includes(uri)) {
                field = "id_user"
                filter = data.filter(l => l[k] === e.target.value)
            }
            else if(uri === "user") {
                field = "lastname"
                filter = data.filter(l => l[k].toLowerCase().match(regex))
            }
            else {
                field = "nom"
                filter = data.filter(l => l[k].toLowerCase().match(regex))
            }
            setFilterData(filter)
        } else setFilterData(data)
    }
    
    useEffect(() => {
        let uriTmp = ""
        let schema = []
        if(path === "/espaces") {
            uriTmp = "space"
            schema = ["nom"]
        }
        else if(path === "/espaces_privatifs") {
            uriTmp = "PrivativeSpace"
            schema = ["nom", "id_space"]
        }
        else if(path === "/equipements") {
            uriTmp = "equipment"
            schema = ["nom", "id_space"]
        }
        else if(path === "/plateaux_repas") {
            uriTmp = "meal"
            schema = ["nom", "id_space"]
        }
        else if(path === "/evenements") {
            uriTmp = "events"
            schema = ["nom", "description", "horaire_debut", "horaire_fin", "nb_places", "id_space"]
        }
        else if(path === "/utilisateurs" || path === "/") {
            uriTmp = "user"
            schema = ["firstname", "lastname", "date_naissance", "email", "pwd", "admin"]
        }
        else if(path === "/reservations/espaces_privatifs") {
            uriTmp = "ReservationPrivateSpace"
            schema = ["horaire_debut", "horaire_fin", "id_espace_privatif", "id_user"]
        }
        else if(path === "/reservations/equipements") {
            uriTmp = "ReservationEquipment"
            schema = ["horaire_debut", "horaire_fin", "id_equipment", "id_user", "rendu"]
        }
        else if(path === "/reservations/plateaux_repas") {
            uriTmp = "ReservationMeal"
            schema = ["horaire", "id_meal", "id_user"]
        }
        else if(path === "/reservations/evenements") {
            uriTmp = "ReservationEvents"
            schema = ["id_user", "id_events"]
        }
        else if(path === "/ticket") {
            uriTmp = "Ticket"
            schema = ["objet", "text", "traitement", "id_user"]
        }
        setUri(uriTmp)
        setSchema(schema)

        if(uri) axios.get('https://cowork-paris.000webhostapp.com/index.php/'+uri).then(res => {
            setData(res.data)
            setFilterData(res.data)
            setIsloading(false)
        })
        .catch(err => console.log(err))

        if(schema.includes("id_space") && isLoadingSpace) {
            axios.get('https://cowork-paris.000webhostapp.com/index.php/space').then(res2 => {
                setSpace(res2.data)
                setIsloadingSpace(false)
                handleFormAdd("id_space", res2.data[0].id)
            }).catch(err => {
                console.log(err)
                setIsloadingSpace(false)
            })
        }
        if(schema.includes("id_user") && isLoadingUsers) {
            axios.get('https://cowork-paris.000webhostapp.com/index.php/user').then(res => {
                setUsers(res.data.filter(u => u.admin !== "true"))
                setIsloadingUsers(false)
                handleFormAdd("id_user", res.data[0].id)
            }).catch(err => {
                console.log(err)
                setIsloadingUsers(false)
            })
        if(schema.includes("rendu")) handleFormAdd("rendu", "oui")
        }

     }, [uri, successModification, successAdd]);
     console.log(formAdd)
    return (
        <>
        <Row>
            <Col className="pb-3">
            <Button variant="info" onClick={() => setAdd(!add)}>Ajouter</Button>
            {add && <Form className="mt-3 mb-3">
                <Form.Row>
                    {schema.map((l,i) => {
                        let tmp
                        if(l.includes("horaire")) tmp =  <Form.Control key={i} placeholder={RealName(uri, l)} type="datetime-local" step="3600" onChange={(e) => handleFormAdd(l, e)} />
                        else tmp = ((schema.includes("id_user") && !isLoadingUsers) || (schema.includes("id_space") && !isLoadingSpace) || (!schema.includes("id_user") && !schema.includes("id_space"))) ? <Select data={{k: l, v: "", disabledModif: false, handleForm: handleFormAdd, space, i, users, uri}}/> : <div className="text-center"><Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true" style={{width: "5em", height: "5em"}}/></div>
                        return <Col>
                            {tmp}
                        </Col>
                        }
                    )}
                    <Col>
                    <Button variant="success" onClick={() => addItem(formAdd, uri, handleSuccessAdd)} disabled={Object.values(formAdd).map(v => {let i = 0; if(v.trim() === "") i++; return i}).includes(1) || Object.keys(schema).length !== Object.keys(formAdd).length}><FontAwesomeIcon icon={faCheck}/></Button>
                    </Col>
                </Form.Row>
                </Form>
                }
                {successAdd !== null && <div className="text-center"><Alert className="mb-0" variant={successAdd ? "success" : "danger"}>
                {successAdd ? "L'élement a bien été ajouté" : "L'ajout a échoué"}
                </Alert></div>}
                <hr/>
                {!["ReservationPrivateSpace", "ReservationEquipment", "ReservationEvents", "ReservationMeal", "Ticket"].includes(uri) ? <FormControl type="text" placeholder="Filtrer par nom" className="mr-auto mt-3 mb-3" onKeyUp={(e) => handleSearch("nom",e)}/> : (!isLoadingUsers) ? <Form.Group><Form.Label>Utilisateur:</Form.Label><Select data={{k: "id_user", v: "", disabledModif: false, handleForm: handleSearch, space, i: 255, users, uri, tous: true}}/></Form.Group> : <div className="text-center"><Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true"/></div>}
                {uri === "ReservationEquipment" && <Form.Group><Form.Label>Equipement rendu:</Form.Label><Form.Control as="select" onChange={(e) => handleSearch("rendu", e)}>
                    <option value="">Tous</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                </Form.Control></Form.Group>}
                {successModification !== null && <div className="text-center"><Alert className="mb-0" variant={successModification ? "success" : "danger"}>
                {successModification ? "Modification effectuée(s)" : "La modification a échoué"}
                </Alert></div>}
            </Col>
        </Row>
        {(!isLoading) && filterData.length > 0 &&
        <Row>
            <Col>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {Object.keys(filterData[0]).filter(k => k !== "id" && k !== "pwd").map((v,i) => (<th key={i}>{RealName(uri, v)}</th>))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterData.map((l,i) => {
                            let tmp = {...l}
                            delete tmp.id
                            delete tmp.pwd
                            return (
                            <>
                                {(schema.includes("id_space") && space) || (schema.includes("id_user") && users) || (!schema.includes("id_space") && !schema.includes("id_user")) ? <TableLine key={i} data={{line: tmp, handleSuccessModification, uri, id: l.id, space, users, uri}}/> : i === 1 && <Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true" style={{width: "5em", height: "5em"}}/>}
                            </>
                            )}
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
        }
        {(isLoading) && <div className="text-center"><Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true" style={{width: "5em", height: "5em"}}/></div>}
        </>
    )
}

function addItem(data, uri, handleSuccessAdd) {
    let formData = new FormData();
    for (const v in data) {
        formData.append(v, data[v]);
    }
    console.log(formData)
    fetch('https://cowork-paris.000webhostapp.com/index.php/'+uri,
        {
            body: formData,
            method: "post"
        })
        .then(res=>res.json())
        .then(res => {
            if(res[0] === "Reservation created successfully." || res[0] === "User created successfully." || res[0] === "Created successfully.") {
                 handleSuccessAdd(Date.now())
            } else {
                handleSuccessAdd(false)
            }
        })
        .catch(e => {
            handleSuccessAdd(false)
        })
}

function TableLine(props) {
    const[disabledModif, setDisabledModif] = useState(true)
    const[form, setForm] = useState(props.data.line)
    let history = useHistory();

    const handleDisabledModif = () => {
        setDisabledModif(!disabledModif)
    }

    const handleForm = (key, e) => {
        let tmp = {...form}
        tmp[key] = e.target.value
        setForm(tmp)
    }
    
    return (
        <tr>
            {Object.keys(props.data.line).map((k,i) => {
                return <td key={i}>{<Select key={i} data={{k, v: props.data.line[k], disabledModif, handleForm, space: props.data.space, i, users: props.data.users, uri: props.data.uri}}/>}</td>
            })}
            <th>
                <div className="text-center">
                    <Button variant="warning" className="mr-2" onClick={() => handleDisabledModif()}>{disabledModif ? "Modifier" : "Annuler"}</Button>
                    {!disabledModif && <Button variant="success" onClick={() => Update(form, props.data.handleSuccessModification, props.data.uri, props.data.id, handleDisabledModif)} disabled={(JSON.stringify(props.data.line) === JSON.stringify(form)) || Object.values(form).map(v => {let i = 0; if(v.trim() === "") i++; return i}).includes(1)}>Valider</Button>}
                    {props.data.uri === "user" && <Button className="ml-2" variant="info" onClick={() => history.push({pathname: '/details', state: { id: props.data.id }})}>Detail</Button>}
                </div>
            </th>
        </tr>
    )
}

function Select(props) {
    const[privativeSpace, setPrivativeSpace] = useState(null)
    const[isLoadingPrivativeSpace, setIsloadingPrivativeSpace] = useState(true)
    const[equipment, setEquipment] = useState(null)
    const[isLoadingEquipment, setIsloadingEquipment] = useState(true)
    const[rendu, setRendu] = useState(["oui", "non"])
    const[traitement, setTraitement] = useState(["en_cours", "archivé"])
    const[admin, setAdmin] = useState(["true", "false"])
    const[meal, setMeal] = useState(null)
    const[isLoadingMeal, setIsloadingMeal] = useState(true)
    const[events, setEvents] = useState(null)
    const[isLoadingEvents, setIsloadingEvents] = useState(true)
    let location  = useLocation()
    console.log(props.data.k)
    console.log(props.data.uri)
    useEffect(() => {
        console.log(props.data.k)
        let url
        if(props.data.k === "id_espace_privatif" && isLoadingPrivativeSpace) {
            if(props.data.v === "") url = "https://cowork-paris.000webhostapp.com/index.php/PrivativeSpace/"
            else url = "https://cowork-paris.000webhostapp.com/index.php/ReservationPrivateSpace/privateSpace/"
            axios.get(url + props.data.v).then(res => {
                setPrivativeSpace(res.data)
                setIsloadingPrivativeSpace(false)
                if(props.data.v === "") props.data.handleForm(props.data.k, res.data[0].id)
            }).catch(err => {
                console.log(err)
                setIsloadingPrivativeSpace(false)
            })
        }
        else if(props.data.k === "id_equipment" && isLoadingEquipment) {
            if(props.data.v === "") url = "https://cowork-paris.000webhostapp.com/index.php/Equipment/"
            else url = "https://cowork-paris.000webhostapp.com/index.php/ReservationEquipment/equipment/"
            axios.get(url + props.data.v).then(res => {
                setEquipment(res.data)
                setIsloadingEquipment(false)
                if(props.data.v === "") props.data.handleForm(props.data.k, res.data[0].id)
            }).catch(err => {
                console.log(err)
                setIsloadingEquipment(false)
            })
        }
        else if(props.data.k === "id_meal" && isLoadingMeal) {
            if(props.data.v === "") url = "https://cowork-paris.000webhostapp.com/index.php/Meal/"
            else url = "https://cowork-paris.000webhostapp.com/index.php/ReservationMeal/meal/"
            axios.get(url + props.data.v).then(res => {
                setMeal(res.data)
                setIsloadingMeal(false)
                if(props.data.v === "") props.data.handleForm(props.data.k, res.data[0].id)
            }).catch(err => {
                console.log(err)
                setIsloadingMeal(false)
            })
        }
        else if(props.data.k === "id_events" && isLoadingEvents) {
            if(props.data.v === "") url = "https://cowork-paris.000webhostapp.com/index.php/Events/"
            else url = "https://cowork-paris.000webhostapp.com/index.php/ReservationEvents/events/"
            axios.get(url + props.data.v).then(res => {
                setEvents(res.data)
                setIsloadingEvents(false)
                if(props.data.v === "") props.data.handleForm(props.data.k, res.data[0].id)
            }).catch(err => {
                console.log(err)
                setIsloadingEvents(false)
            })
        }
    }, [props.data.k === "id_espace_privatif", props.data.k === "id_equipment", props.data.k === "id_meal"])
    if(location.pathname === "/reservations/equipements" && props.data.k !== "rendu" && props.data.v !== "") props.data.disabledModif = true
    if(location.pathname === "/ticket" && props.data.k !== "traitement" && props.data.v !== "") props.data.disabledModif = true
    let allOps = <option key={1000} value="">Tous</option>
    console.log(props.data)
    return (
        <>
            {props.data.k !== "id_space"  && props.data.k !== "id_espace_privatif" && props.data.k !== "id_user" && props.data.k !== "id_equipment" && props.data.k !== "rendu" && props.data.k !== "id_meal" && props.data.k !== "id_events" && props.data.k !== "traitement" && props.data.k !== "admin" && <Form.Control as={props.data.uri === "Ticket" && props.data.k === "text" ? "textarea" : "input"} placeholder={RealName(props.data.uri, props.data.k)} key={props.data.i+100} defaultValue={props.data.v} disabled={props.data.disabledModif} onKeyUp={(l) => props.data.handleForm(props.data.k, l)}/>}
            {props.data.k === "id_space" && <Form.Control as="select" key={props.data.i+100} defaultValue={props.data.v} disabled={props.data.disabledModif} onChange={(l) => props.data.handleForm(props.data.k, l)} >{props.data.space.map((v,i) => <option key={i} value={v.id}>{v.nom}</option>)}</Form.Control>}
            {props.data.k === "id_espace_privatif" && !isLoadingPrivativeSpace && <Form.Control as="select" key={props.data.i+100} defaultValue={props.data.v} disabled={props.data.disabledModif} onChange={(l) => props.data.handleForm(props.data.k, l)} >{privativeSpace.map((v,i) => <option key={i} value={v.id}>{v.nom}</option>)}</Form.Control>}
            {props.data.k === "id_espace_privatif" && isLoadingPrivativeSpace && <div className="text-center"><Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true"/></div>}
            {props.data.k === "id_user" && <Form.Control as="select" key={props.data.i+100} defaultValue={props.data.tous ? "" : props.data.v} disabled={props.data.disabledModif} onChange={(l) => props.data.handleForm(props.data.k, l)} >{ true ? [allOps, ...props.data.users.map((v,i) => <option key={i} value={v.id}>{v.firstname + " " + v.lastname}</option>)] : props.data.users.map((v,i) => <option key={i} value={v.id}>{v.firstname + " " + v.lastname}</option>)}</Form.Control>}
            {props.data.k === "id_equipment" && !isLoadingEquipment && <Form.Control as="select" key={props.data.i+110} defaultValue={props.data.v} disabled={props.data.disabledModif} onChange={(l) => props.data.handleForm(props.data.k, l)} >{equipment.map((v,i) => <option key={i} value={v.id}>{v.nom}</option>)}</Form.Control>}
            {props.data.k === "id_equipment" && isLoadingEquipment && <div className="text-center"><Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true"/></div>}
            {props.data.k === "rendu" && <Form.Control as="select" key={props.data.i+120} defaultValue={props.data.v} disabled={props.data.disabledModif} onChange={(l) => props.data.handleForm(props.data.k, l)} >{rendu.map((v,i) => <option key={i} value={v}>{v}</option>)}</Form.Control>}
            {props.data.k === "id_meal" && !isLoadingMeal && <Form.Control as="select" key={props.data.i+110} defaultValue={props.data.v} disabled={props.data.disabledModif} onChange={(l) => props.data.handleForm(props.data.k, l)} >{meal.map((v,i) => <option key={i} value={v.id}>{v.nom}</option>)}</Form.Control>}
            {props.data.k === "id_meal" && isLoadingMeal && <div className="text-center"><Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true"/></div>}
            {props.data.k === "id_events" && !isLoadingEvents && <Form.Control as="select" key={props.data.i+110} defaultValue={props.data.v} disabled={props.data.disabledModif} onChange={(l) => props.data.handleForm(props.data.k, l)} >{events.map((v,i) => <option key={i} value={v.id}>{v.nom}</option>)}</Form.Control>}
            {props.data.k === "id_events" && isLoadingEvents && <div className="text-center"><Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true"/></div>}
            {props.data.k === "traitement" && <Form.Control as="select" key={props.data.i+120} defaultValue={props.data.v} disabled={props.data.disabledModif} onChange={(l) => props.data.handleForm(props.data.k, l)} >{traitement.map((v,i) => <option key={i} value={v}>{RealName(props.data.uri, v)}</option>)}</Form.Control>}
            {props.data.k === "admin" && <Form.Control as="select" key={props.data.i+120} defaultValue={props.data.v} disabled={props.data.disabledModif} onChange={(l) => props.data.handleForm(props.data.k, l)} >{admin.map((v,i) => <option key={i} value={v}>{RealName(props.data.uri, v)}</option>)}</Form.Control>}
        </>
        //<Form.Control as={privativeSpace || space ? "select" : ""} defaultValue={space ? space.filter(e => e.id === props.data.v)[0].nom : privativeSpace ? privativeSpace.filter(e => e.id === props.data.v)[0].nom : props.data.v} disabled={props.data.disabledModif} onKeyUp={(l) => props.data.handleForm(props.data.k, l)}/>
    )

}

function Update(data, handleSuccessModification, uri, id, handleDisabledModif) {
    let formData = new FormData();
    for (const v in data) {
        formData.append(v, data[v]);
    }
    console.log(formData)
    fetch('https://cowork-paris.000webhostapp.com/index.php/'+uri+'/update/'+id,
        {
            body: formData,
            method: "post"
        })
        .then(res=>res.json())
        .then(res => {
            if(res[0] === "User updated successfully.") {
                for (const key in data) {
                    setCookie(key, data[key], 1)
                 }
                 handleDisabledModif(true)
                 handleSuccessModification(Date.now())
            } else {
                handleSuccessModification(false)
            }
        })
        .catch(e => {
            handleSuccessModification(false)
        })
}

function Delete() {
    
}