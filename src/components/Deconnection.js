import React, { useState } from 'react';
import {getCookie, deleteCookie, upperCaseFirst} from '../util/util';

const deleteUser = () => {
    deleteCookie("id", "/")
    deleteCookie("firstname", "/")
    deleteCookie("lastname", "/")
    deleteCookie("date_naissance", "/")
    deleteCookie("email", "/")
    deleteCookie("pwd", "/")
    deleteCookie("admin", "/")
  }

export function Deconnection(setConnected) {
    deleteUser()
    setConnected(false)
}