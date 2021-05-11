import { useEffect, useState } from "react";
import Styles from "./styles.module.scss"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import { Modal, Button, ProgressBar, } from "react-bootstrap";

import Healthbar from "./Healthbar"
import { Box, Slider } from "@material-ui/core";

export default function Active() {
  const [loaded, setLoaded] = useState(false)
  const [newData, setNewData] = useState(false)

  const [idActive, setIdActive] = useState("")
  const [inputName, setInputName] = useState('')
  const [selectStatusValue, setSelectStatusValue] = useState('Em Operação')
  const [selectBranchValue, setSelectBranchValue] = useState('1')
  const [responsible, setResponsible] = useState('')
  const [healthLevel, setHealthLevel] = useState("100")

  const [dadosActive, setDadosActive] = useState([])
  const [dadosBranch, setDadosBranch] = useState([])

  const [show, setShow] = useState(false);

  //Open/Close Modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showImg, setShowImg] = useState(false);
  const [modalImgURL, setModalImgURL] = useState("")

  const handleCloseImg = () => setShowImg(false);
  const handleShowImg = () => setShowImg(true);
  

  function healthBarColor(health) {
    let bgColor = ""
    if (health > 60) {
      bgColor = "sucess"
    }
    else if (health < 60 && health > 35) {
      bgColor = "warning"
    }
    else {
      bgColor = "danger"
    }
    return bgColor
  }

  useEffect(() => {
    async function api<T>(url: string): Promise<T> {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setLoaded(true)
      return await response.json();
    }
    api('https://backend-challenge-tractian.herokuapp.com/active')
      .then(data => setDadosActive([data]))
      .catch(error => {
      })

    api('https://backend-challenge-tractian.herokuapp.com/branch')
      .then(data => setDadosBranch([data]))
      .catch(error => {
      })
    setNewData(false)
  }, [newData])

  function handleRemove(id) {
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

    api(`https://backend-challenge-tractian.herokuapp.com/active/${id}`)
      .then(data => setDadosActive([data]))
      .catch(error => {
      })

    setNewData(true)
  }

  async function updateActive(e) {
    e.preventDefault()
    handleClose()
    const input = document.querySelector('input[type="file"]')
    if (inputName === "" || selectStatusValue === "" || healthLevel === "" || responsible === "") {
      return
    }
    const formData = new FormData()
    formData.append("name", inputName)
    formData.append("id", selectBranchValue)
    //@ts-ignore
    formData.append('image', input.files[0])
    formData.append('status', selectStatusValue)
    formData.append('healthLevel', healthLevel)
    formData.append('responsible', responsible)


    await fetch(`https://backend-challenge-tractian.herokuapp.com/active/${idActive}`, {
      method: 'put',
      body: formData
    })

    setInputName('')
    setResponsible('')
    setHealthLevel("100")
    setSelectStatusValue("Em Operação")
    setNewData(true)
  }

  function modalObject() {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Atualizar Ativo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className={Styles.form} onSubmit={updateActive}>
            <label htmlFor="name">Nome do Ativo</label>
            <input type="text" name="name" placeholder="Ativo X" value={inputName} onChange={e => setInputName(e.target.value)} />

            <label htmlFor="status">Status</label>
            <select onChange={(e) => setSelectStatusValue(e.target.value)} value={selectStatusValue}>
              <option value="Em Operação">Em Operação</option>
              <option value="Em Alerta">Em Alerta</option>
              <option value="Em Parada">Em Parada</option>
            </select>

            <label htmlFor="responsible">Responsável</label>
            <input type="text" value={responsible} onChange={e => setResponsible(e.target.value)} />

            <label htmlFor="company">Pertence a Unidade</label>
            <select onChange={(e) => setSelectBranchValue(e.target.value)} value={selectBranchValue}>
              <option value="1"></option>
              {dadosBranch.map(d => d.map(dede =>
                <option value={dede._id}>{dede.name}</option>
              ))}
            </select>

            <label htmlFor="healthLevel">Nível de saúde</label>
            <Slider className={Styles.slider} onChange={(e, value) => setHealthLevel(value.toString())} value={Number(healthLevel)} />
            <input type="number" onChange={(e) => setHealthLevel(e.target.value.toString())} value={parseInt(healthLevel)} />

            <label htmlFor="">Image do Ativo</label>
            <input type="file" name="file" />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
      </Button>
          <Button variant="primary" onClick={updateActive}>
            Salvar Alterações
      </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function modalImage() {
    return (
      <Modal show={showImg} onHide={handleCloseImg} className={Styles.imgContainerModal}>
        
          <img src={modalImgURL} alt="" className={Styles.imgModal}/>
      </Modal>
    );
  }

  function renderActiveCards() {
    const [data] = dadosActive
    if (loaded && (!(data === undefined))) {
      return (<div className={Styles.container}>{data.map(d =>
        <div className={Styles.activeCard}>
          <div className={Styles.iconContainer}>
            <span onClick={() => { handleRemove(d._id) }}>X</span>
            <FontAwesomeIcon icon={faPencilAlt} size='2x' className={Styles.icon} onClick={() => {
              handleShow();
              setIdActive(d._id)
              setInputName(d.name)
              setResponsible(d.responsible)
              setHealthLevel(d.healthLevel)
              setSelectStatusValue(d.status)
            }} />
          </div>

          <div className={Styles.layoutContainer}>
            <div className={d.img ? Styles.img : ""}>
              <img src={d.img} alt="" onClick={()=>{setModalImgURL(d.img);handleShowImg()}}/>
            </div>
            <div className={Styles.infoContainer}>
              <div className={Styles.insideContainer}>
                <h3>Nome</h3>
                <p>{d.name}</p>
              </div>
              <div className={Styles.insideContainer}>
                <h3>Status</h3>
                <p>{d.status}</p>
              </div>
              <div className={Styles.insideContainer}>
                <h3>Responsável</h3>
                <p>{d.responsible}</p>
              </div>
              <div className={Styles.insideContainer}>
                <h3>Unidade</h3>
                <p>{d.branch ? d.branch.name : ""}</p>
              </div>
              <div className={Styles.insideContainerLast}>
                <h3>Nível de Saúde</h3>
                <ProgressBar animated style={{ height: 25 }} now={d.healthLevel} label={`${d.healthLevel}%`} variant={healthBarColor(d.healthLevel)} />
              </div>
            </div>
          </div>
        </div>
      )}</div>)
    } else {
      return (<div className={Styles.load}>Carregando...</div>)
    }
  }

  return (
    <div>
      {renderActiveCards()}
      {modalObject()}
      {modalImage()}
    </div>
  )
}