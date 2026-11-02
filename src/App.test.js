import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('converte reais em dólares usando a API', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ rates: { USD: 20 } }),
    })
  );

  render(<App />);

  const amount = screen.getByLabelText(/valor/i);
  userEvent.clear(amount);
  userEvent.type(amount, '100');
  userEvent.click(screen.getByRole('button', { name: /converter/i }));

  await waitFor(() => {
    expect(screen.getByText(/100,00 BRL = 20,00 USD/i)).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.frankfurter.app/latest?amount=100&from=BRL&to=USD'
  );
});
