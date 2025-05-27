import React from 'react';

export default function CurrencySelectorModal({ open, onClose, onSelect }) {
  const [customCurrency, setCustomCurrency] = React.useState("");
  
  if (!open) return null
  
  const currencies = ["THB", "USD", "EUR", "GBP", "JPY", "INR"]
  
  const handleCustomCurrencySubmit = () => {
    if (customCurrency.trim()) {
      onSelect(customCurrency.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-icy rounded-[13px] p-6 w-80 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-hornbill font-black text-twilight pb-4 pt-2">
          Select a Currency
        </h2>
        <div className="grid gap-2">
          {currencies.map((currency) => (
            <button
              key={currency}
              className="w-full px-4 py-2 text-left text-twilight rounded hover:bg-gray-100 border"
              onClick={() => {
                onSelect(currency)
                onClose()
              }}
            >
              {currency}
            </button>
          ))}
          
          {/* Custom currency input :3 */}
          <div className="mt-1 border-t pt-4 border-twilight">
            <h3 className="text-twilight font-bold mb-2">Custom Currency</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customCurrency}
                onChange={(e) => setCustomCurrency(e.target.value)}
                placeholder="currency/symbol"
                className="flex-1 px-4 py-2 border rounded text-twilight"
                maxLength={5}
              />
              <button
                onClick={handleCustomCurrencySubmit}
                className="px-3 py-2 bg-twilight text-white rounded"
                disabled={!customCurrency.trim()}
              >
                Use
              </button>
            </div>
          </div>
        </div>
        
        <button
          className="mt-4 text-sm rounded-[13px] text-white hover:underline border p-4 bg-twilight w-full"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
