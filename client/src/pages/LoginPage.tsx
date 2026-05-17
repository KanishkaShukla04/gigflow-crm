import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleLogin = async (
  e: React.FormEvent
) => {

  e.preventDefault();
  if (!email || !password) {

  setError("All fields are required");

  return;

}

  setLoading(true);

  setError("");

  try {

    const res = await API.post(
      "/auth/login",
      {
        email,
        password
      }
    );

    localStorage.setItem(
      "userInfo",
      JSON.stringify(res.data)
    );

    navigate("/dashboard");

  } catch (err: any) {

    setError(
      err.response?.data?.message ||
      "Login failed"
    );

  } finally {

    setLoading(false);

  }

};
  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          GigFlow CRM
        </h1>
        {error && (

  <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">

    {error}

  </div>

)}

      <form onSubmit={handleLogin}className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border p-3 rounded-lg"
          />

          <button
  className={`w-full py-3 rounded-lg text-white ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-black"
  }`}
  disabled={loading}
>

  {loading ? "Loading..." : "Login"}

</button>

        </form>

      </div>

    </div>

  );
};

export default LoginPage;