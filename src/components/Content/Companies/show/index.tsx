import { useState, useEffect } from 'react'
import Styles from './styles.module.scss'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import { Modal, Button } from "react-bootstrap";


export default function Companies() {

    //Fetch data from api
    const [dadosCompany, setDadosCompany] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [newData, setNewData] = useState(false)


    //Modal-Update
    const [inputValue, setInputValue] = useState("")
    const [idCompany, setIdCompany] = useState("")
    const [show, setShow] = useState(false);

    //Fetch Data
    useEffect(() => {
        async function api<T>(url: string): Promise<T> {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            setLoaded(true)
            return await response.json();

        }

        api('https://backend-challenge-tractian.herokuapp.com/company')
            .then(data => setDadosCompany([data]))
            .catch(error => {
            })

        setNewData(false)
    }, [newData])

    //Remove Company
    function handleRemove(id, e) {
        console.log(id)
        console.log(e.target.parentNode)

        async function api<T>(url: string): Promise<T> {
            const response = await fetch(url, { method: "DELETE" });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            setLoaded(true)
            return await response.json();
        }

        api(`https://backend-challenge-tractian.herokuapp.com/company/${id}`)
            .then(data => setDadosCompany([data]))
            .catch(error => {
            })
        setNewData(true)
    }

    //Open/Close Modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //UpdateCompany
    function updateCompany(e) {
        e.preventDefault()
        handleClose()
        const payload = { name: inputValue }
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

        api(`https://backend-challenge-tractian.herokuapp.com/company/${idCompany}`)
            .then(data => console.log(data))
            .catch(error => {
            })
        setNewData(true)
        setInputValue('')
    }


    function modalObject() {
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Atualizar Empresa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className={Styles.form} onSubmit={(e) => updateCompany(e)}>
                        <label htmlFor="name">Nome da Empresa</label>
                        <input type="text" name="name" id="" value={inputValue} onChange={e => setInputValue(e.target.value)} />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
          </Button>
                    <Button variant="primary" onClick={(e) => updateCompany(e)}>
                        Salvar Alterações
          </Button>
                </Modal.Footer>
            </Modal>
        );
    }


    function renderCompanyCards() {
        if (loaded) {
            return (<div className={Styles.container}>

                {dadosCompany.map(d =>
                    d.map(dede =>
                        <div className={Styles.companyCard}>
                            <div className={Styles.iconContainer}>
                                <button onClick={(e) => { handleRemove(dede._id, e) }}>X</button>
                                <FontAwesomeIcon icon={faPencilAlt} size='2x' className={Styles.icon}
                                    onClick={() => { setIdCompany(dede._id); handleShow() }} />

                            </div>
                            <h1>{dede.name}</h1>
                            <ul><h2>Unidades:</h2>
                                {dede.branch.map(didi => <li><strong>{didi.name}</strong></li>)}
                            </ul>
                        </div>
                    )

                )}</div>)
        } else {
            return (<div className={Styles.load}>Carregando...</div>)
        }
    }

    return (
        <div>
            {renderCompanyCards()}
            {modalObject()}
        </div>
    )
}