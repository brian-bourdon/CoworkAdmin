import React, { useState } from 'react';
import {getCookie, deleteCookie, upperCaseFirst} from '../util/util';
import { propTypes } from 'react-bootstrap/esm/Image';
import {useHistory} from "react-router-dom";

const deleteUser = () => {
    deleteCookie("id", "/")
    deleteCookie("firstname", "/")
    deleteCookie("lastname", "/")
    deleteCookie("date_naissance", "/")
    deleteCookie("email", "/")
    deleteCookie("pwd", "/")
    deleteCookie("admin", "/")
    deleteCookie("id_abonnement", "/")
    deleteCookie("created_at", "/")
  }

export function Deconnection(setConnected, history) {
  deleteUser()
  setConnected(null)
  history.push('/')
}