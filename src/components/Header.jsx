import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo-natcare.png'
import { usePanier } from '../lib/panier'
import { terminerVol } from '../lib/volProduit'
import PanierMenu from './PanierMenu'
import './Header.css'

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const { nombre } = usePanier()
  const fermer = useCallback(() => setMenuOuvert(false), [])

  return (
    <>
      <header className="header">
        <Link to="/" viewTransition onClick={terminerVol} aria-label="Nat'Care — accueil">
          <img className="header__logo" src={logo} alt="Nat'Care" />
        </Link>
        <button
          className="header__menu"
          type="button"
          aria-label={nombre > 0 ? `Ma commande (${nombre} article(s))` : 'Ma commande'}
          aria-expanded={menuOuvert}
          onClick={() => setMenuOuvert(true)}
        >
          <span />
          <span />
          <span />
          {nombre > 0 && <b className="header__pastille">{nombre}</b>}
        </button>
      </header>
      <PanierMenu ouvert={menuOuvert} onFermer={fermer} />
    </>
  )
}
