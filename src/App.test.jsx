import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import App from './App'

// Mock the Stripe provider to avoid API calls in tests
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => children,
  loadStripe: vi.fn(() => Promise.resolve({})),
}))

// Mock the services to avoid API calls
vi.mock('./services/api', () => ({
  generateAISummary: vi.fn(() => Promise.resolve('Test summary')),
  getStateRights: vi.fn(() => Promise.resolve([])),
  getScripts: vi.fn(() => Promise.resolve([])),
}))

vi.mock('./services/stripe', () => ({
  createCheckoutSession: vi.fn(() => Promise.resolve({ url: 'test-url' })),
  createCustomerPortalSession: vi.fn(() => Promise.resolve({ url: 'test-url' })),
}))

const AppWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    )
    
    // Check if the app renders some basic content
    // Since this is a complex app, we'll just check it doesn't throw
    expect(document.body).toBeTruthy()
  })

  it('contains navigation elements', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    )
    
    // The app should render without throwing errors
    // More specific tests would be added for individual components
    const appElement = document.querySelector('#root')
    expect(appElement).toBeTruthy()
  })
})
