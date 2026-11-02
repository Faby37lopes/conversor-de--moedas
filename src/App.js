import { useState } from 'react';
import './App.css';

const currencies = ['BRL', 'USD', 'EUR', 'GBP'];

function App() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('USD');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function convertCurrency(event) {
    event.preventDefault();

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setResult(null);
      setError('Digite um valor válido maior que zero.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${value}&from=${fromCurrency}&to=${toCurrency}`
      );

      if (!response.ok) {
        throw new Error('Não foi possível obter a cotação.');
      }

      const data = await response.json();
      setResult(data.rates[toCurrency]);
    } catch (apiError) {
      setResult(null);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function swapCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setError('');
  }

  return (
    <main className="converter-page">
      <section className="converter-card">
        <h1>Conversor de moedas</h1>

        <form onSubmit={convertCurrency}>
          <label htmlFor="amount">Valor</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <div className="currency-row">
            <div>
              <label htmlFor="fromCurrency">De</label>
              <select
                id="fromCurrency"
                value={fromCurrency}
                onChange={(event) => setFromCurrency(event.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>

            <button
              className="swap-button"
              type="button"
              onClick={swapCurrencies}
              aria-label="Trocar moedas"
            >
              ⇄
            </button>

            <div>
              <label htmlFor="toCurrency">Para</label>
              <select
                id="toCurrency"
                value={toCurrency}
                onChange={(event) => setToCurrency(event.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="convert-button" type="submit" disabled={loading}>
            {loading ? 'Consultando...' : 'Converter'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {result !== null && (
          <p className="result" aria-live="polite">
            {Number(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {fromCurrency}
            {' = '}
            {result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {toCurrency}
          </p>
        )}

        <small>Cotação obtida da API Frankfurter.</small>
      </section>
    </main>
  );
}

export default App;
