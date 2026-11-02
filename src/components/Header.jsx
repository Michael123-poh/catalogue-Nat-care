import { Link } from 'react-router-dom'
import logo from '../assets/logo-natcare.png'
import { terminerVol } from '../lib/volProduit'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <Link to="/" viewTransition onClick={terminerVol} aria-label="Nat'Care — accueil">
        <img className="header__logo" src={logo} alt="Nat'Care" />
      </Link>
      <button className="header__menu" type="button" aria-label="Ouvrir le menu">
        <span />
        <span />
        <span />
      </button>
    </header>
  )
}
