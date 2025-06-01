import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../src/app/page'

 
describe('Page', () => {
  process.env.NEXT_PUBLIC_BACKEND_URL = 'http://mocked-backend-url.com';
  it('renders a heading', () => {
    render(<Page />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })
})