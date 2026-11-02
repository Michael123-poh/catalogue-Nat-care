import { Outlet } from 'react-router-dom'
import Header from './Header'

// Mise en page commune : l'en-tête reste en place d'une page à l'autre, seul le contenu change
export default function Racine() {
  return (
    <>
      <Header />
      <div className="racine__contenu">
        <Outlet />
      </div>
    </>
  )
}
