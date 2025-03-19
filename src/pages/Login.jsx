import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <>
      <h1 className="text-3xl font-black text-[#51508B]">Hello World</h1>
      <Link to="/" className="!underline">
        Temp btn to go back
      </Link>
    </>
  );
}

export default Login;
