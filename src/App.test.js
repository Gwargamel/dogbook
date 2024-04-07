import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the dog daycare headline', () => {
  render(<App />);
  const headlineElement = screen.getByText(/Hunddagis/i);
  expect(headlineElement).toBeInTheDocument();
});
