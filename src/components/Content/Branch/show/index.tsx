import Styles from "./styles.module.scss"
import { useState, useEffect } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import { Modal, Button } from "react-bootstrap";

export default function Branch() {
  const [dadosBranch, setDadosBranch] = useState([])
  const [dadosCompany, setDadosCompany] = useState([])
  const [newData, setNewData] = useState(false)

  const [loaded, setLoaded] = useState(false)

  //Modal-Update
  const [branchInputValue, setBranchInputValue] = useState("")
  const [idCompany, setIdCompany] = useState("")
  const [idBranch, setIdBranch] = useState("")
  const [show, setShow] = useState(false);

  //Open/Close Modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Fetch Branch Data
  useEffect(() => {
    async function api<T>(url: string): Promise<T> {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setLoaded(true)
      return await response.json();
    }

    api('https://backend-challenge-tractian.herokuapp.com/branch')
      .then(data => setDadosBranch([data]))
      .catch(error => {
      })

    api('https://backend-challenge-tractian.herokuapp.com/company')
      .then(data => setDadosCompany([data]))
      .catch(error => {
      })

    setNewData(false)
  }, [newData])


  function modalObject() {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Atualizar Unidade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => updateBranch(e)} className={Styles.form}>
            <label htmlFor="name">Nome da Unidade</label>
            <input type="text" name="name" value={branchInputValue} onChange={e => setBranchInputValue(e.target.value)} />

            <label htmlFor="company">Pertence a Empresa</label>
            <select onChange={(e) => setIdCompany(e.target.value)} value={idCompany}>
              <option value="1"></option>
              {dadosCompany.map(d => d.map(dede =>
                <option value={dede._id}>{dede.name}</option>
              ))}
            </select>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
      </Button>
          <Button variant="primary" onClick={(e) => updateBranch(e)}>
            Salvar Alterações
      </Button>
        </Modal.Footer>
      </Modal>
    );
  }


  function updateBranch(e) {
    e.preventDefault()
    handleClose()
    if (branchInputValue === "") {
      return
    }
    const payload = { name: branchInputValue, id: idCompany }
    setBranchInputValue('')
    async function api<T>(url: string): Promise<T> {
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setNewData(true)
      return await response.json();
    }

    console.log(idBranch)
    console.log(idCompany)
    api(`https://backend-challenge-tractian.herokuapp.com/branch/${idBranch}`)
      .then(data => console.log(data))
      .catch(error => {
      })

    setBranchInputValue('')
    setIdCompany('')
    setIdBranch('')
  }

  //Remove Branch
  function handleRemove(idBranch, idCompany, e) {
    async function api<T>(url: string): Promise<T> {
      const response = await fetch(url, {
        method: "DELETE",
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      })
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setLoaded(true)
      return await response.json();
    }

    api(`https://backend-challenge-tractian.herokuapp.com/branch/${idBranch}`)
      .then(data => setDadosBranch([data]))
      .catch(error => {
      })

    setNewData(true)
  }


  function renderBranchCards() {
    if (loaded) {
      return (
        <>
      <div className={Styles.container}>{dadosBranch.map(d =>
        d.map(dede =>
            <div className={Styles.branchCard}>
              <div className={Styles.iconContainer}>
                <button onClick={(e) => { handleRemove(dede._id, dede.company? dede.company._id:"1", e) }}>X</button>
                <FontAwesomeIcon icon={faPencilAlt} size='2x' className={Styles.icon}
                  onClick={() => { setIdCompany(dede.company ? dede.company._id : ""); handleShow(); setIdBranch(dede._id) }} />
              </div>
              <div>
                <h1>{dede.name}</h1>
              </div>

              <div>
                <h3>Empresa:</h3>
                <p>{dede.company ? dede.company.name : ""}</p>

                <h3>Ativos:</h3>
                {dede? dede.active.map(d=><p><strong>{d.name}</strong></p>):""}

                
              </div>
            </div>

        )

      )}</div></>)
    } else {
      return (<div className={Styles.load}>Carregando...</div>)

    }
  }


  return (
    <div>
      {renderBranchCards()}
      {modalObject()}
    </div>
  )
}
