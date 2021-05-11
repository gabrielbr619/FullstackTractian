import { useState,useEffect } from 'react'
import Styles from './styles.module.scss'

export default function UserCreate(){
  const [newData, setNewData] = useState(false)
  const [dadosCompany, setDadosCompany] = useState([])

  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)

  const [inputEmail, setInputEmail] = useState("")
  const [inputPassword, setInputPassword] = useState("")
  const [selectCompanyValue, setSelectCompanyValue] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    if(inputEmail==="" || inputPassword ===""){
      return
    }
    setLoading(true)
    setDisable(true)
    const payload = { email: inputEmail, password: inputPassword, id: selectCompanyValue }

    async function api<T>(url: string): Promise<T> {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();

    }

    api('https://backend-challenge-tractian.herokuapp.com/user')
      .then(data => console.log(data))
      .catch(error => {
      })

    setNewData(true)
    setInputEmail('')
    setInputPassword('')
  }

  function loadingRender(){
    if(loading){
      setTimeout(()=>{setLoading(false);setDisable(false)},1000)
      return <h2>Carregando...</h2>
    }
    else{return}
  }

  useEffect(() => {
    async function api<T>(url: string): Promise<T> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();

    }
    api('https://backend-challenge-tractian.herokuapp.com/company')
        .then(data => setDadosCompany([data]))
        .catch(error => {
        })
        setNewData(true)
}, [newData])

  return(
    <div className={Styles.container}>
      
      <div>
        <h1>Cadastrar Usuário</h1>

        <form onSubmit={(e) => handleSubmit(e)}>
          

            <label htmlFor="name">Seu email</label>
            <input type="text" name="name" placeholder="email@email.com" value={inputEmail} onChange={e => setInputEmail(e.target.value)} disabled={disable} />

            <label htmlFor="name">Sua senha</label>
            <input type="password" name="name" placeholder="email@email.com" value={inputPassword} onChange={e => setInputPassword(e.target.value)} disabled={disable} />

            <label htmlFor="company">Trabalha na Empresa</label>
            <select onChange={(e)=>setSelectCompanyValue(e.target.value)} value={selectCompanyValue}>
            <option value="1"></option>
              {dadosCompany.map(d=>d.map(dede=>
                <option value={dede._id}>{dede.name}</option>
                ))}
            </select>
            <button disabled={disable}>Criar</button>
        </form>
        {loadingRender()}
      </div>
    </div>
  )
}