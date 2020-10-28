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

    const handleFormAdd = (key, e) => {
        let tmp = {...formAdd}
        tmp[key] = e.target.value
        setFormAdd(tmp)
    }

    const handleSuccessModification = (v) => {
        setSuccessModification(v)
    }

    const handleSuccessAdd = (v) => {
        setSuccessAdd(v)
    }

    const handleSearch = (e) => {
        let regex = new RegExp( e.target.value.toLowerCase(), 'g');
        console.log(data)
        console.log(data.filter(l => l.firstname.toLowerCase().match(regex)))
        if(uri !== "user") setFilterData(data.filter(l => l.nom.toLowerCase().match(regex)))
        else setFilterData(data.filter(l => l.firstname.toLowerCase().match(regex)))
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
        setUri(uriTmp)
        setSchema(schema)

        if(uri) axios.get('https://cowork-paris.000webhostapp.com/index.php/'+uri).then(res => {
            setData(res.data)
            setFilterData(res.data)
            setIsloading(false)
        })
        .catch(err => console.log(err))

        if(isLoadingSpace) {
            axios.get('https://cowork-paris.000webhostapp.com/index.php/space').then(res => {
                setSpace(res.data)
                setIsloadingSpace(false)
            }).catch(err => {
                console.log(err)
                setIsloadingSpace(false)
            })
        }
     }, [uri, successModification, successAdd]);
    return (
        <>
        <Row>
            <Col className="pb-3">
            <Button variant="info" onClick={() => setAdd(!add)}>Ajouter</Button>
            {add && <Form className="mt-3 mb-3">
                <Form.Row>
                    {schema.map(l => {
                        let tmp
                        if(l.includes("horaire")) tmp =  <Form.Control placeholder={l} type="datetime-local" step="3600" value={moment(new Date()).format("YYYY-MM-DDTHH:00")} onKeyUp={(e) => handleFormAdd(l, e)} />
                        else tmp = <Form.Control placeholder={l} onKeyUp={(e) => handleFormAdd(l, e)} />
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
                <FormControl type="text" placeholder="Filtrer par nom" className="mr-auto mt-3 mb-3" onKeyUp={(e) => handleSearch(e)}/>
                {successModification !== null && <div className="text-center"><Alert className="mb-0" variant={successModification ? "success" : "danger"}>
                {successModification ? "Modification effectuée(s)" : "La modification a échoué"}
                </Alert></div>}
            </Col>
        </Row>
        {(!isLoading && !isLoadingSpace) && filterData.length > 0 &&
        <Row>
            <Col>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {Object.keys(filterData[0]).filter(k => k !== "id").map((v,i) => (<th key={i}>{RealName(uri, v)}</th>))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterData.map(l => {
                            let tmp = {...l}
                            delete tmp.id
                            return (
                            <TableLine key={l.id} data={{line: tmp, handleSuccessModification, uri, id: l.id, space}}/>
                            )}
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
        }
        {(isLoading || isLoadingSpace) && <div className="text-center"><Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true" style={{width: "5em", height: "5em"}}/></div>}
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
            if(res[0] === "Created successfully.") {
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
    let history = useHistory()

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
                let tmp
                if(k === "id_space"&& disabledModif) tmp = <Form.Control defaultValue={props.data.space.filter(e => e.id === props.data.line[k])[0].nom} disabled={disabledModif} onKeyUp={(v) => handleForm(k, v)}/>
                else if(k === "id_space" && !disabledModif) tmp = (<Form.Control as="select" defaultValue={props.data.line[k]} onChange={(v) => handleForm(k, v)}>{props.data.space.map(v => <option value={v.id}>{v.nom}</option>)}</Form.Control>)
                else tmp = <Form.Control defaultValue={props.data.line[k]} disabled={disabledModif} onKeyUp={(v) => handleForm(k, v)}/>
                return <td key={i}>{tmp}</td>
            })}
            <th>
                <div className="text-center">
                    <Button variant="warning" className="mr-2" onClick={() => handleDisabledModif()}>{disabledModif ? "Modifier" : "Annuler"}</Button>
                    {!disabledModif && <Button variant="success" onClick={() => Update(form, props.data.handleSuccessModification, props.data.uri, props.data.id, handleDisabledModif)} disabled={(JSON.stringify(props.data.line) === JSON.stringify(form)) || Object.values(form).map(v => {let i = 0; if(v.trim() === "") i++; return i}).includes(1)}>Valider</Button>}
                    {disabledModif && <Button variant="danger">Supprimer</Button>}
                    {props.data.uri === "user" && <Button className="ml-2" variant="info" onClick={() => history.push({pathname: '/details', state: { id: props.data.id }})}>Detail</Button>}
                </div>
            </th>
        </tr>
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