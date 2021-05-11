import Styles from './styles.module.scss'
import { useState } from "react";

export default function CompanyCreate() {
  const [inputName, setInputName] = useState('')

  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)


  function handleSubmit(e) {
    e.preventDefault()
    if(inputName===""){
      return
    }
    setLoading(true)
    setDisable(true)
    const payload = { name: inputName }

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

    api('https://backend-challenge-tractian.herokuapp.com/company')
      .then(data => console.log(data))
      .catch(error => {
      })

    setInputName('')
  }

  function loadingRender(){
    if(loading){

      setTimeout(()=>{setLoading(false);setDisable(false)},1000)
      return <h2>Carregando...</h2>
    }else{return}
    
  }

  return (
    <div className={Styles.container}>
      <div>
        <h1>Cadastrar Empresa</h1>

        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="name">Nome da Empresa</label>
            <input type="text" name="name" placeholder="Empresa X" value={inputName} onChange={e => setInputName(e.target.value)} disabled={disable} />
          </div>
          <button disabled={disable}>Criar</button>
        </form>
        {loadingRender()}
      </div>
    </div>
  )
}