import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const picture = searchParams.get('picture'); 
  useEffect(() => {
    if (!name || !email) {
      navigate('/');
    }
  }, [name, email, navigate]);

  const handleLogout = () => {
    window.location.href = "http://localhost:5001/auth/logout";
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      <main className="p-10 w-full max-w-xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">User Profile</h1>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-6">
            <img
              src={picture || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-md object-cover"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
              <p className="text-gray-500">{email}</p>
            </div>
          </div>

          <button
            className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </section>
      </main>
    </div>
  );
}
