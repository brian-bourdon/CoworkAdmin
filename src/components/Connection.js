import {setCookie} from '../util/util';
import axios from 'axios'

export function Connection(email, pwd, setIsLoading, setSuccess, history, setConnected) {
    setIsLoading(true)
    axios.get('https://cowork-paris.000webhostapp.com/index.php/user/show/'+email)
    .then(res => {
      console.log(res.data)
      if(res.data.pwd === pwd && res.data.admin === "true") {
        for (const key in res.data) {
            setCookie(key, res.data[key], 1)
          }
          setIsLoading(false)
          setConnected(true)
          history.push("/")
      }
      else{
        setIsLoading(false)
        setConnected(false)
        setSuccess(false)
      }
    }).catch(e => {
      setIsLoading(false)
      setConnected(false)
      setSuccess(false)
    })
  }