import React from 'react'

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