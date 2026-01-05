import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import UserContext from './store/UserContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import ProblemContext from './store/ProblemContext.jsx'
import {Toaster} from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-y0qjlwjql7gty6cb.us.auth0.com"
    clientId="So9yhxi3a95U9eQ7jpsFSDSVrhbqIxin"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <BrowserRouter> 
        <UserContext>
          <ProblemContext>
            <StrictMode>
              <App />
            </StrictMode>
          </ProblemContext>
        </UserContext> 
    </BrowserRouter>
  </Auth0Provider>
  
)
