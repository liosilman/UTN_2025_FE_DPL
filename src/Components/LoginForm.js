// components/LoginForm.js

import { useState } from "react";
import { useRouter } from "next/navigation";
import useApiRequest from "../hooks/useApiRequest"; // Asegúrate de tener el hook correctamente

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { loading, error, request } = useApiRequest();

  const validateForm = () => {
    const newErrors = {};
    if (!values.email) newErrors.email = "Email is required";
    if (!values.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = await request("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (data.token) {
        sessionStorage.setItem("authorization_token", data.token);
        router.push("/workspaces");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={values.email} onChange={handleChange} />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={values.password} onChange={handleChange} />
          {errors.password && <p>{errors.password}</p>}
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
