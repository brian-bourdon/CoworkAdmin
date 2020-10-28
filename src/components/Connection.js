import {setCookie} from '../util/util';
import axios from 'axios'
import md5 from 'crypto-js/md5';

export function Connection(email, pwd, setIsLoading, setSuccess, history, setConnected, success) {
    setIsLoading(true)
    axios.get('https://cowork-paris.000webhostapp.com/index.php/user/show/'+email)
    .then(res => {
      console.log(res.data)
      if(res.data.pwd === pwd && res.data.admin === "true") {
        for (const key in res.data) {
            if(key !== "pwd") setCookie(key, res.data[key], 1)
          }
          //setSuccess(true)
          setIsLoading(false)
          setConnected(true)
          history.push("/")
      }
      else{
        console.log("ok")
        setIsLoading(false)
        setSuccess(false)
        //setConnected(false)
      }
    }).catch(e => {
      setSuccess(false)
      setIsLoading(false)
      setConnected(false)
    })
  }