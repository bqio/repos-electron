import 'react-photo-view/dist/react-photo-view.css'
import './index.css'

import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>
)
