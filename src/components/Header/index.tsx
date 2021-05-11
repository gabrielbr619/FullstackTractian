import Styles from './styles.module.scss'
import { Dropdown } from "react-bootstrap";
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <div className={Styles.header}>
      <div>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">
          Novo
      </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item>
            <NavLink to="/company/create" className={Styles.a}>Empresa</NavLink>
            </Dropdown.Item>
          <Dropdown.Item>
            <NavLink to="/branch/create" className={Styles.a}>Unidade</NavLink>
            </Dropdown.Item>
          <Dropdown.Item>
            <NavLink exact to="/active/create" className={Styles.a}>Ativo</NavLink>
            </Dropdown.Item>
          <Dropdown.Item>
            <NavLink to="/user/create" className={Styles.a}>Usuário</NavLink>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
        </div>
      <div className={Styles.user}>
        <p>Gabriel Lara</p>
        <img src="/images/pp.jfif" alt="" />
      </div>

    </div>
  )
}