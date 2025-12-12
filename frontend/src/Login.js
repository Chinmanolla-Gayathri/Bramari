import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin'); 
      } else {
        setError("Incorrect Password");
      }
    } catch (err) {
      setError("Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-saree-cream flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-xl shadow-2xl border-2 border-saree-gold w-full max-w-md text-center">
        
        {/* LOGO (UPDATED BIGGER SIZE) */}
        <div className="flex justify-center mb-6">
            {/* Logo increased from h-24 w-24 to h-32 w-32 */}
            <img src="/logo.jpg" alt="Bramari" className="h-32 w-32 rounded-full border-4 border-saree-maroon shadow-lg" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-saree-maroon mb-2">Bramari Admin</h1>
        <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">Restricted Access</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="password" 
            placeholder="Enter Secret Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 border border-gray-300 rounded focus:border-saree-maroon outline-none text-center text-lg"
          />
          {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
          <button type="submit" className="bg-saree-maroon text-saree-gold font-bold py-3 rounded hover:bg-opacity-90 transition shadow-lg">Login</button>
        </form>

        <button onClick={() => navigate('/')} className="mt-6 text-gray-400 text-sm hover:text-saree-maroon underline">← Back to Shop</button>
      </div>
    </div>
  );
}

export default Login;