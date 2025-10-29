import { useState } from 'react'
import './App.css'
import InvoiceForm from './components/InvoiceForm'
import InvoicePreview from './components/InvoicePreview'
import InvoiceHistory from './components/InvoiceHistory'
import ProductManager from './components/ProductManager'
import Login from './components/Login'
import Register from './components/Register'
import UserProfile from './components/UserProfile'
import { UserProvider, useUser } from './contexts/UserContext'
import type { Invoice } from './types/billing'

type AppView = 'form' | 'preview' | 'history' | 'products' | 'profile';
type AuthView = 'login' | 'register';

const AppContent: React.FC = () => {
  const { user, isLoading } = useUser();
  const [authView, setAuthView] = useState<AuthView>('login');

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return (
      <AuthContainer 
        authView={authView} 
        setAuthView={setAuthView}
      />
    );
  }

  return <BillingApp />;
};

const AuthContainer: React.FC<{ authView: AuthView; setAuthView: (view: AuthView) => void }> = ({ authView, setAuthView }) => {
  const { login } = useUser();

  return (
    <div className="app">
      {authView === 'login' ? (
        <Login 
          onLogin={login}
          onShowRegister={() => setAuthView('register')}
        />
      ) : (
        <Register 
          onRegister={login}
          onShowLogin={() => setAuthView('login')}
        />
      )}
    </div>
  );
};

const BillingApp: React.FC = () => {
  const { user, logout } = useUser();
  const [currentView, setCurrentView] = useState<AppView>('form')
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleInvoiceCreate = (invoice: Invoice) => {
    setCurrentInvoice(invoice)
    setCurrentView('preview')
  }

  const handleBack = () => {
    setCurrentView('form')
    setCurrentInvoice(null)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleViewHistory = () => {
    setCurrentView('history')
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice)
    setCurrentView('preview')
  }

  const handleCloseHistory = () => {
    setCurrentView('form')
  }

  const handleManageProducts = () => {
    setCurrentView('products')
  }

  const handleCloseProducts = () => {
    setCurrentView('form')
    setRefreshKey(prev => prev + 1) // Trigger refresh of InvoiceForm
  }

  const handleShowProfile = () => {
    setCurrentView('profile')
  }

  const handleCloseProfile = () => {
    setCurrentView('form')
  }

  return (
    <div className="app">
      <div className="app-header">
        <div className="header-top">
          <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>
            Billing Application
          </h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleShowProfile} className="profile-btn">Profile</button>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
        
        {currentView === 'form' && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button onClick={handleManageProducts} className="products-btn">
              Manage Products
            </button>
            <button onClick={handleViewHistory} className="history-btn">
              View Invoice History
            </button>
          </div>
        )}
      </div>
      
      {currentView === 'form' && (
        <InvoiceForm key={refreshKey} onInvoiceCreate={handleInvoiceCreate} />
      )}
      
      {currentView === 'preview' && currentInvoice && (
        <InvoicePreview 
          invoice={currentInvoice} 
          onBack={handleBack}
          onPrint={handlePrint}
        />
      )}
      
      {currentView === 'history' && (
        <InvoiceHistory 
          onViewInvoice={handleViewInvoice}
          onClose={handleCloseHistory}
        />
      )}
      
      {currentView === 'products' && (
        <ProductManager onClose={handleCloseProducts} />
      )}
      
      {currentView === 'profile' && (
        <UserProfile onClose={handleCloseProfile} />
      )}
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App
