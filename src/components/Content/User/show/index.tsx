import { useState, useEffect } from "react";
import Styles from './styles.module.scss'

import { Modal, Button } from "react-bootstrap";

import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function User() {
  const [loaded, setLoaded] = useState(false)
  const [newData, setNewData] = useState(false)
  const [userData, setUserData] = useState([])
  const [companyData, setCompanyData] = useState([])

  const [show, setShow] = useState(false);

  const [inputEmail, setInputEmail] = useState("")
  const [inputPassword, setInputPassword] = useState("")
  const [idCompany, setIdCompany] = useState("")
  const [idUser, setIdUser] = useState("")

  //Open/Close Modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    async function api<T>(url: string): Promise<T> {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setLoaded(true)
      return await response.json();
    }

    api('https://backend-challenge-tractian.herokuapp.com/users')
      .then(data => setUserData([data]))
      .catch(error => {
      })

    api('https://backend-challenge-tractian.herokuapp.com/company')
      .then(data => setCompanyData([data]))
      .catch(error => {
      })
    setNewData(false)
  }, [newData])


  function handleRemove(id, e) {

    async function api<T>(url: string): Promise<T> {
        const response = await fetch(url, { method: "DELETE" });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        setLoaded(true)
        return await response.json();
    }

    api(`https://backend-challenge-tractian.herokuapp.com/user/${id}`)
        .then(data => setUserData([data]))
        .catch(error => {
        })
    setNewData(true)
}

  function updateUser(e) {
    e.preventDefault()
    handleClose()
    const payload = { email: inputEmail, password: inputPassword, company: idCompany }
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
      return await response.json();

    }

    api(`https://backend-challenge-tractian.herokuapp.com/company/${idUser}`)
      .then(data => console.log(data))
      .catch(error => {
      })
    setNewData(true)
    setInputEmail('')
    setInputPassword('')
    setIdCompany('')

  }

  function modalObject() {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Atualizar Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className={Styles.form} onSubmit={(e) => updateUser(e)}>
            <label htmlFor="email">Email do usuário</label>
            <input type="text" name="email" id="" value={inputEmail} onChange={e => setInputEmail(e.target.value)} />

            <label htmlFor="password">Senha do usuário</label>
            <input type="text" name="password" id="" value={inputPassword} onChange={e => setInputPassword(e.target.value)} />

            <label htmlFor="company">Trabalha na Empresa</label>
            <select onChange={(e) => setIdCompany(e.target.value)} value={idCompany}>
              <option value="1"></option>
              {companyData.map(d => d.map(dede =>
                <option value={dede._id}>{dede.name}</option>
              ))}
            </select>

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
      </Button>
          <Button variant="primary" onClick={(e) => updateUser(e)}>
            Salvar Alterações
      </Button>
        </Modal.Footer>
      </Modal>
    );
  }


  function renderUsers() {
    const [usersData] = userData
    if (loaded && usersData) {
      return (<div>
        <h1>Olá mundo</h1>
        <div className={Styles.container}>
          {usersData.map(d =>
            <div className={Styles.cardUser}>
              <div className={Styles.iconContainer}>
              <button onClick={(e) => { handleRemove(d._id, e) }}>X</button>
              <FontAwesomeIcon icon={faPencilAlt} size='2x' className={Styles.icon}
                onClick={() => { setIdUser(d._id); handleShow() }} />
              </div>
              <h2>{d.email}</h2>
              <h4>Empresa</h4>
              <p>{d.company ? d.company.name : ""}</p>
            </div>
          )}
        </div>
      </div>)
    } else {
      return (<div className={Styles.load}>Carregando...</div>)
    }
  }

  return (
    <div>
      {modalObject()}
      {renderUsers()}
    </div>
  )
}