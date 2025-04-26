export default function CurrencySelectorModal({ open, onClose, onSelect }) {
    if (!open) return null
  
    const currencies = ["THB", "USD", "EUR", "GBP", "JPY", "INR"]
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="bg-icy rounded-[13px] p-6 w-80 shadow-xl">
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
          </div>
          <button
            className="mt-4 text-sm rounded-[13px] text-white hover:underline border p-4 bg-twilight"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }
  