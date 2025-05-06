import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "/assets/icons/logo.svg";
import email from "/assets/icons/email.svg";
import oeye from "/assets/icons/oeye.svg";
import ceye from "/assets/icons/ceye.svg";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (loginError) setLoginError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const result = await login(formData);

      if (result.success) {
        navigate("/friendlist");
      } else {
        setLoginError(
          result.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Network error. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center overflow-hidden mx-auto">
        <div className="w-full flex justify-center mt-4">
          <div className="w-[10vw] h-[8vw] max-w-[12%] max-h-[12%] scale-[4] transform-gpu mt-[10vh] mb-[8vh] sm:w-[60px] sm:h-[60px] sm:scale-[1.5] sm:mt-[2vh] sm:mb-0">
            <img src={logo} alt="DebtMate Logo" />
          </div>
        </div>

        <h1 className="font-hornbill text-[10vw] mb-[6vh] font-black sm:text-[48px] text-twilight mt-[2vh] mb-[3vh] sm:mb-[2vh]">
          Debt Mate
        </h1>

        <div className="w-[99%] max-w-[100vw] mx-[20vw] px-[6%] py-[2vh] mb-[vh] -mt-[1vh] bg-icy rounded-3xl sm:w-[500px] sm:mx-auto sm:px-[40px] sm:py-[20px]">
          <h2 className="text-twilight text-[9vw] px-2 pt-5 sm:text-[32px] font-hornbill font-bold pt-2 sm:px-0 sm:mb-[15px]">
            Login
          </h2>

          <form
            className="space-y-[3vh] mt-[3vh] sm:space-y-[20px] sm:mt-[15px]"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full py-[1vh] px-[6%] border border-gray-300 rounded-2xl placeholder-gray-300 text-gray-800 placeholder:text-[4vw] placeholder:font-telegraf sm:py-[10px] sm:placeholder:text-[14px] transition-all duration-300 ease-in-out hover:border-2 hover:border-pale focus:border focus:border-twilight focus:shadow-inner focus:outline-none"
                autoComplete="email"
                noValidate
              />
              <div className="flex items-center justify-center absolute right-[6%] top-0 bottom-0">
                <img src={email} alt="Email Icon" />
              </div>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full py-[1vh] px-[6%] border border-gray-300 rounded-2xl placeholder-gray-300 text-gray-800 placeholder:text-[4vw] placeholder:font-telegraf sm:py-[10px] sm:placeholder:text-[14px] transition-all duration-300 ease-in-out hover:border-2 hover:border-pale focus:border focus:border-twilight focus:shadow-inner focus:outline-none"
              />
              <div
                className="flex items-center justify-center absolute right-[6%] top-0 bottom-0 cursor-pointer"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Open eye icon
                  <img src={oeye} alt="Password Open Icon" />
                ) : (
                  <img src={ceye} alt="Password Closed Icon" />
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="bg-twilight text-[5vw] sm:text-[18px] text-icy w-[40%] py-[0.6vh] mx-[2vw] -mb-[2vh] font-bold rounded-2xl font-hornbill shadow-lg sm:w-[150px] sm:py-[8px] sm:my-[5px] hover:bg-[#434273] active:bg-[#3b3b66]"
              >
                Login
              </button>
            </div>
          </form>

          {loginError && (
            <p className="text-red-500 text-sm mt-2">{loginError}</p>
          )}

          <div className="mt-[2vh] sm:mt-[15px]">
            <Link
              to="/signup"
              className="!text-black text-[3.5vw] sm:text-[14px] font-telegraf"
            >
              Don't have an account?{" "}
              <u className="text-twilight hover:text-[#7775cc]">Sign Up</u>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
