import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Racine from './components/Racine'
import Catalogue from './pages/Catalogue'
import CategoriePage from './pages/CategoriePage'

// Un routeur "data" est nécessaire pour les transitions de vue (viewTransition)
const router = createBrowserRouter([
  {
    element: <Racine />,
    children: [
      { path: '/', element: <Catalogue /> },
      { path: '/catalogue/:categorieId', element: <CategoriePage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
