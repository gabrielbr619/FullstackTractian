import { useState,useEffect } from 'react'
import Styles from './styles.module.scss'

export default function BranchCreate(){

  const [dadosCompany, setDadosCompany] = useState([])
  const [newData, setNewData] = useState(false)

  const [selectValue, setSelectValue] = useState('')
  const [inputName, setInputName] = useState('')

  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)


  function handleSubmit(e) {
    console.log(e)
    console.log(selectValue)
    e.preventDefault()
    if(inputName===""){
      return
    }
    setLoading(true)
    setDisable(true)
    const payload = { name: inputName, id: selectValue }



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

    api('https://backend-challenge-tractian.herokuapp.com/branch')
      .then(data => console.log(data))
      .catch(error => {
      })

    setNewData(true)
    setInputName('')
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
        <h1>Cadastrar Unidade</h1>

        <form onSubmit={(e) => handleSubmit(e)}>
          <div>

            <label htmlFor="name">Nome da Unidade</label>
            <input type="text" name="name" placeholder="Unidade Y" value={inputName} onChange={e => setInputName(e.target.value)} disabled={disable} />

            <label htmlFor="company">Pertence a Empresa</label>
            <select onChange={(e)=>setSelectValue(e.target.value)} value={selectValue}>
            <option value="1"></option>
              {dadosCompany.map(d=>d.map(dede=>
                <option value={dede._id}>{dede.name}</option>
                ))}
            </select>

          </div>
          <button disabled={disable}>Criar</button>
        </form>
        {loadingRender()}
      </div>
    </div>
  )
}