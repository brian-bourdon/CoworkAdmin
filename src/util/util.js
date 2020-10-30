import React from 'react'
import moment from 'moment';


export const setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

export const getCookie = (name) => {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    })
    return cookie[name];
  }

export const deleteCookie = ( name, path ) => {
    if( getCookie( name ) ) {
      document.cookie = name + "=" +
        ((path) ? ";path="+path:"")+
        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  }

  export const upperCaseFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
  
  export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  }

  export const text_sans_abonnment = (<><p>Payez le temps passé sur
    place, les consommations
    sont incluses et à volonté !</p>
    <p>Accessible sans
    réservation ou
    abonnement.</p>
    <p>Tarifs par personne :
    Première heure : 5€
    ½ heure suivante : 2,5€
    Journée (5 heures et plus) :
    24€
    </p>
    <p>Réduction étudiante :
    Journée (5 heures et plus) :
    20€
    </p>
    <p>Accès open space (sans
    possibilité de changer
    d'adresse)
    Wifi
    Snacking et boissons à
    volonté
    Cabines téléphonique
    </p></>)
  export const text_abonnment_simple = (<>
    <p>Rejoignez la communauté
  CO'WORK et bénéficiez de
  tarifs préférentiels !</p>
  <p>Tarifs membre par
  personne :
  Première heure : 4€
  ½ heure suivante : 2€
  Journée (5 heures et plus) :
  20€</p>
  <p>Devenir membre sans
  engagement :
  24€ TTC /mois</p>
  <p>Devenir membre sans
  engagement 12 mois :
  20€ TTC /mois
  </p>
  <p>Accès open space
  Wifi
  Snacking et boissons à
  volonté
  Cabines téléphonique
  Accès libre à tous les
  espaces
  Accès premium au HUB
  </p>
    </>)
  export const text_abonnement_residant = (<>
  <p>Rejoignez la communauté
  CO'WORK et devenez
  membre résident !</p>
  <p>Bénéficiez d'un accès en
  illimité 7/7j</p>
  <p>Devenir membre résident
  sans engagement :
  300€ TTC /mois
  </p>
  <p>Devenir membre résident
  avec engagement 8 mois:
  252€ TTC /mois</p>
  </>)
  

export function RealName(table, key) {
  console.log(table)
  console.log(key)
  let realName = null
  if(table === "user") {
      if(key === "firstname") realName = "Prénom"
      else if(key === "lastname") realName = "Nom"
      else if(key === "date_naissance") realName = "Date de naissance"
      else if(key === "email") realName = "Email"
      else if(key === "admin") realName = "Administrateur"
      else if(key === "nom") realName = "Type d'abonnement"
      else if(key === "pwd") realName = "Mot de passe"
      else if(key === "false") realName = "Non"
      else if(key === "true") realName = "Oui"
  }
  else if(table === "res_privative") {
      if(key === "horaire_debut") realName = "Horaire de début"
      else if(key === "horaire_fin") realName = "Horaire de fin"
      else if(key === "id_espace_privatif") realName = "Nom de l'espace privatif"
      else if(key === "nom") realName = "Nom"
  }
  else if(table === "res_equipment") {
      if(key === "horaire_debut") realName = "Horaire de début"
      else if(key === "horaire_fin") realName = "Horaire de fin"
      else if(key === "id_equipment") realName = "Equipment"
  }
  else if(table === "res_meal") {
      if(key === "horaire") realName = "Horaire"
      else if(key === "id_meal") realName = "Plateau repas"
  }
  else if(table === "res_events") {
      if(key === "id_events") realName = "Evenement"
  }
  else if(table === "space") {
    if(key === "nom") realName = "Nom"
  }
  else if(table === "PrivativeSpace") {
    if(key === "nom") realName = "Nom"
    else if(key === "id_space") realName = "Espace"
  }
  else if(table === "equipment") {
    if(key === "nom") realName = "Nom"
    else if(key === "id_space") realName = "Espace"
  }
  else if(table === "meal") {
    if(key === "nom") realName = "Nom"
    else if(key === "id_space") realName = "Espace"
  }
  else if(table === "events") {
    if(key === "nom") realName = "Nom"
    else if(key === "description") realName = "Description"
    else if(key === "horaire_debut") realName = "Horaire de début"
    else if(key === "horaire_fin") realName = "Horaire de fin"
    else if(key === "nb_places") realName = "Nombre de places"
    else if(key === "id_space") realName = "Espace"
  }
  else if(table === "ReservationPrivateSpace") {
    if(key === "horaire_debut") realName = "Horaire de début"
    else if(key === "horaire_fin") realName = "Horaire de fin"
    else if(key === "id_espace_privatif") realName = "Espace Privatif"
    else if(key === "id_user") realName = "Utilisateur"
  }
  else if(table === "ReservationEquipment") {
    if(key === "horaire_debut") realName = "Horaire de début"
    else if(key === "horaire_fin") realName = "Horaire de fin"
    else if(key === "id_equipment") realName = "Equipement"
    else if(key === "id_user") realName = "Utilisateur"
    else if(key === "rendu") realName = "Equipement rendu"
  }
  else if(table === "ReservationMeal") {
    if(key === "horaire") realName = "Horaire"
    else if(key === "id_meal") realName = "Plateau repas"
    else if(key === "id_user") realName = "Utilisateur"
  }
  else if(table === "ReservationEvents") {
    if(key === "id_user") realName = "Utilisateur"
    else if(key === "id_events") realName = "Evenement/Animation"
  }
  else if(table === "Ticket") {
    if(key === "objet") realName = "Objet"
    else if(key === "text") realName = "Texte"
    else if(key === "traitement") realName = "Traitement"
    else if(key === "id_user") realName = "Utilisateur"
    else if(key === "en_cours") realName = "En cours"
    else if(key === "archivé") realName = "Résolu/Archivé"
  }
  console.log(realName)
  if(realName) return realName
  else return key
}

export function endAbonnementToString(id_abonnement, created_at) {
  let s = ""
  if(id_abonnement === "2") s = "Prendra fin le " + formatStringToDate(created_at)
  if(id_abonnement === "4") s = "Prendra fin le " + formatStringToDate(created_at)
  return s
}

export function formatStringToDate(s) {
  return  moment(new Date(s)).add(1, 'years').format('DD/MM/YYYY') + " à " +  moment(new Date(s)).add(1, 'years').format('HH') + "h" + moment(new Date(s)).add(1, 'years').format('mm')
}