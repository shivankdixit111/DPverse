import React, { useContext } from 'react'
import { userDataContext } from '../store/UserContext';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

export default function TokenPlan() {
  const { token, currentUser, setUpdationOccur, loading } = useContext(userDataContext);
  if(!currentUser.email) {
    return <Loader />
  }

  console.log('email is ', currentUser.email)

  const plans = [
    {
      id: 'basic',
      price: 1,
      currency: '₹',
      tokens: 3,
      subtitle: 'Starter pack',
      highlight: false,
    },
    {
      id: 'pro',
      price: 1,
      currency: '₹',
      tokens: 130,
      subtitle: 'Most popular',
      highlight: true,
    },
    {
      id: 'elite',
      price: 50,
      currency: '₹',
      tokens: 500,
      subtitle: 'Best value',
      highlight: false,
    },
  ]

  const handleBuy = async(plan) => {
    // placeholder: integrate payment flow here 
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/make-payment`, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({amount: plan.price, tokens: plan.tokens})
    })

        const data = await response.json();
        console.log('data is ', data)
        console.log('razor id ', import.meta.env.VITE_RAZORPAY_KEY_ID)

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            order_id: data.id,
            name: "DP-Verse Premium",
            description: "Upgrade Subscription",
            handler: async function(response) {
                alert("success")
                console.log('payment response ------>>> ',response)
                const body = {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature, 
                    email: currentUser.email,
                    tokens: plan.tokens
                }

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/payment/verfiy`, {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });   
                if(res.ok) {
                    setUpdationOccur(prev => !prev)
                    toast.success("Payment successful 🎉");
                } else {
                    toast.error("Payment unsuccessful ❌");
                }
            }
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-8">
          <h2 className="text-3xl font-extrabold">Token Plans</h2>
          <p className="mt-2 text-sm text-gray-600">Pick a plan that fits your practice — transparent pricing, instant tokens.</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-3">
          {plans.map((p) => {
            const perToken = (p.price / p.tokens).toFixed(2)
            return (
              <div
                key={p.id}
                className={`relative rounded-2xl p-6 shadow-lg border transform transition-transform hover:-translate-y-1 ${
                  p.highlight ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white border-indigo-700' : 'bg-white'
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 right-4 inline-block rounded-full px-3 py-1 text-xs font-semibold bg-white text-indigo-600">Most value</span>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-bold ${p.highlight ? 'text-white' : 'text-gray-900'}`}>{p.subtitle}</h3>
                    <p className={`mt-1 text-sm ${p.highlight ? 'text-indigo-100' : 'text-gray-500'}`}>Instant token credit</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-extrabold ${p.highlight ? 'text-white' : 'text-gray-900'}`}>{p.currency}{p.price}</span>
                      <span className={`text-sm ${p.highlight ? 'text-indigo-100' : 'text-gray-500'}`}>/ one-time</span>
                    </div>
                    <div className={`mt-1 text-sm ${p.highlight ? 'text-indigo-100' : 'text-gray-600'}`}>
                      {p.tokens} tokens • ₹{perToken}/token
                    </div>
                  </div>
                </div>

                <ul className={`mt-6 space-y-2 text-sm ${p.highlight ? 'text-indigo-50' : 'text-gray-600'}`}>
                  <li>✅ Instant credit</li>
                  <li>✅ Use across the platform</li>
                  <li>✅ No expiry for now</li>
                </ul>

                <div className="mt-6">
                  <button
                    onClick={() => handleBuy(p)}
                    className={`w-full rounded-lg px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      p.highlight
                        ? 'bg-white text-indigo-600 hover:opacity-95 focus:ring-white/40'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                    }`}
                  >
                    {p.highlight ? 'Choose Plan' : 'Buy Now'}
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-400">Payments via UPI / Card (demo)</div>
              </div>
            )
          })}
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Need a custom bundle? Contact support.</p>
        </footer>
      </div>
    </div>
  )
}
