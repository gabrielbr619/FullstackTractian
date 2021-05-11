import { Slider } from '@material-ui/core'
import { useEffect, useState } from 'react'
import Styles from './styles.module.scss'


export default function ActiveCreate() {

  const [dadosBranch, setDadosBranch] = useState([])
  const [newData, setNewData] = useState(false)

//Dados do Form
  const [inputName, setInputName] = useState('')
  const [selectStatusValue, setSelectStatusValue] = useState('Em Operação')
  const [selectBranchValue, setSelectBranchValue] = useState('')
  const [responsible, setResponsible] = useState('')
  const [healthLevel, setHealthLevel] = useState("100")
  const [imageFile, setImageFile] = useState({})

  const [test, setTest] = useState("")

  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)
  const [verification, setVerification] = useState(true)

  useEffect(() => {
    async function api<T>(url: string): Promise<T> {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();

    }
    api('https://backend-challenge-tractian.herokuapp.com/branch')
      .then(data => setDadosBranch([data]))
      .catch(error => {
      })
    setNewData(true)
  }, [newData])


  function handleSubmit(e) {
    e.preventDefault()
    const input = document.querySelector('input[type="file"]')
    if(selectBranchValue===""){
      setSelectBranchValue('1')
    }
    if(inputName===""||selectStatusValue===""||healthLevel===""||responsible===""){
     return setVerification(false)
    }
    setLoading(true)
    setDisable(true)
    const formData = new FormData()
    formData.append("name", inputName)
    formData.append("id", selectBranchValue)
   //@ts-ignore
    formData.append('image', input.files[0])
    formData.append('status', selectStatusValue)
    formData.append('healthLevel', healthLevel)
    formData.append('responsible', responsible)


    fetch('https://backend-challenge-tractian.herokuapp.com/active', {
      method: 'post',
      body: formData
    })

    setNewData(true)
    setInputName('')
    setResponsible('')
    setHealthLevel("100")
    setSelectStatusValue("Em Operação")
    setSelectBranchValue('')

  }


  function loadingRender() {
    if (loading) {
      setTimeout(() => { setLoading(false); setDisable(false) }, 1000)
      return <h2>Carregando...</h2>
    }
    else { return }
  }


  function handleImage(e) {
    const input = document.querySelector('input[type="file"]')
    const data = new FormData()
    //@ts-expect-error
    data.append('image', input.files[0])
    data.append('user', 'teste')

    fetch('https://backend-challenge-tractian.herokuapp.com/active/image', {
      method: 'post',
      body: data
    })
    console.log(data)
  }

  function InvalidData(){
    if(!verification){
      return(<p className={Styles.invalidData}>Dados inválidos</p>)
    }
    setTimeout(()=>setVerification(true),2500)

  }

  return (

    <div className={Styles.container}>
      <div>
        <h1>Cadastrar Ativo</h1>

        <form onSubmit={(e) => handleSubmit(e)}>
          <div>

            <label htmlFor="name">Nome do Ativo</label>
            <input type="text" name="name" placeholder="Ativo X" value={inputName} onChange={e => setInputName(e.target.value)} disabled={disable} />

            <label htmlFor="status">Status</label>
            <select onChange={(e) => setSelectStatusValue(e.target.value)} value={selectStatusValue}>
              <option value="Em Operação">Em Operação</option>
              <option value="Em Alerta">Em Alerta</option>
              <option value="Em Parada">Em Parada</option>
            </select>

            <label htmlFor="company">Pertence a Unidade</label>
            <select onChange={(e) => setSelectBranchValue(e.target.value)} value={selectBranchValue}>
              <option value="null"></option>
              {dadosBranch.map(d => d.map(dede =>
                <option value={dede._id}>{dede.name}</option>
              ))}
            </select>

            <label htmlFor="responsible">Responsável</label>
            <input type="text" value={responsible} onChange={e => setResponsible(e.target.value)} />

            <label htmlFor="healthLevel">Nível de saúde</label>
            <Slider onChange={(e, value) => setHealthLevel(value.toString())} value={Number(healthLevel)}/>
            <input type="number" onChange={(e) => setHealthLevel(e.target.value.toString())} value={parseInt(healthLevel)} />
          <input type="file" name="file" className={Styles.uploadButton}/>
          {InvalidData()}
          </div>
          <button disabled={disable}>Criar</button>
        </form>

        {loadingRender()}
      </div>
    </div>
  )
}