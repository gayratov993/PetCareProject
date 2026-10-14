import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './app/store.js'
import { initI18n } from './i18n/i18n.js'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import './styles/index.css'
import App from './App.jsx'

initI18n().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Provider>
    </StrictMode>,
  )
})
