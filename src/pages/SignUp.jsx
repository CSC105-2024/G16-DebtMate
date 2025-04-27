import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { AuthContext } from "../context/AuthContext";
import logo from "/assets/icons/logo.svg";
import username from "/assets/icons/username.svg";
import email from "/assets/icons/email.svg";
import oeye from "/assets/icons/oeye.svg";
import ceye from "/assets/icons/ceye.svg";

// dont get freak out by this long css
// this is just a template for every textbox on this page
const baseInputClass = `w-full py-[1vh] px-[6%] border rounded-2xl placeholder-gray-300 text-gray-800 
  placeholder:text-[4vw] placeholder:font-telegraf sm:py-[10px] sm:placeholder:text-[14px] 
  transition-all duration-300 ease-in-out hover:border-2 hover:border-pale focus:border 
  focus:border-twilight focus:shadow-inner focus:outline-none`;

function SignUp() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Zod schema
  const signupSchema = z
    .object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  const fieldNames = ["username", "email", "password", "confirmPassword"];
  // check field for error (type)
  const validateField = (name, value) => {
    try {
      const validations = {
        username: () => z.string().parse(value),
        email: () => z.string().email("Invalid email address").parse(value),
        password: () =>
          z
            .string()
            .min(6, "Password must be at least 6 characters")
            .parse(value),
        confirmPassword: () => {
          if (value !== formData.password) {
            throw new Error("Passwords do not match");
          }
          return true;
        },
      };

      // if it exists
      if (validations[name]) {
        validations[name]();
      }

      return "";
    } catch (err) {
      return err.errors?.[0]?.message || err.message;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // check as user types
    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));

    // whether "password do not match" text is shown or not
    if (name === "password" && formData.confirmPassword) {
      const confirmError =
        value !== formData.confirmPassword ? "Passwords do not match" : "";
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = Object.fromEntries(
      fieldNames.map((name) => [name, validateField(name, formData[name])])
    );

    setErrors(newErrors);

    // Check errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return; // if any errors exist do not summit
    }

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        // Save current user (for session)
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        // Set logged in flag
        localStorage.setItem("isLoggedIn", "true");

        // Update authentication state
        setIsAuthenticated(true);

        // Redirect to home
        navigate("/friendlist");
      } else {
        if (data.message.includes("User already exists")) {
          // Handle username/email already exists
          if (data.message.includes("username")) {
            setErrors((prev) => ({
              ...prev,
              username: "Username already exists",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              email: "Email already exists",
            }));
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center overflow-hidden mx-auto">
        {/* Logo  */}
        <div className="w-full flex justify-center mt-4">
          <div className="w-[10vw] h-[8vw] max-w-[12%] max-h-[12%] scale-[4] transform-gpu mt-[10vh] mb-[8vh] sm:w-[60px] sm:h-[60px] sm:scale-[1.5] sm:mt-[2vh] sm:mb-0">
            <img src={logo} alt="Debt Mate Logo" />
          </div>
        </div>

        <h1 className="font-hornbill text-[10vw] mb-[6vh] font-black sm:text-[48px] text-twilight mt-[2vh] mb-[3vh] sm:mb-[2vh]">
          Debt Mate
        </h1>

        <div className="w-[99%] max-w-[100vw] mx-[20vw] px-[6%] py-[2vh] mb-[vh] -mt-[1vh] bg-icy rounded-3xl sm:w-[500px] sm:mx-auto sm:px-[40px] sm:py-[30px]">
          <h2 className="text-twilight text-[9vw] px-2 pt-5 sm:text-[32px] font-hornbill font-bold pt-2 sm:px-0 sm:mb-[20px]">
            Create Account
          </h2>

          <form
            className="space-y-[3vh] mt-[3vh] sm:space-y-[20px] sm:mt-[20px]"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="flex flex-col">
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className={`${baseInputClass} ${
                    errors.username ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <div className="flex items-center justify-center absolute right-[6%] top-0 bottom-0">
                  <img src={username} alt="Username Icon" />
                </div>
              </div>
              {errors.username && (
                <p className="text-red-500 text-[3vw] sm:text-xs mt-1 ml-2">
                  {errors.username}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={`${baseInputClass} ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <div className="flex items-center justify-center absolute right-[6%] top-0 bottom-0">
                  <img src={email} alt="Email icon" />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-[3vw] sm:text-xs mt-1 ml-2">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`${baseInputClass} ${
                    errors.password ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <div
                  className="flex items-center justify-center absolute right-[6%] top-0 bottom-0 cursor-pointer"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Open eye icon
                    <img src={oeye} alt="Open Eye Icon" />
                  ) : (
                    <img src={ceye} alt="Close Eye Icon" />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[3vw] sm:text-xs mt-1 ml-2">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`${baseInputClass} ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />
                <div
                  className="flex items-center justify-center absolute right-[6%] top-0 bottom-0 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmed password"
                      : "Show confirmed password"
                  }
                >
                  {showConfirmPassword ? (
                    <img src={oeye} alt="Open Eye Icon" />
                  ) : (
                    <img src={ceye} alt="Close Eye Icon" />
                  )}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[3vw] sm:text-xs mt-1 ml-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="bg-twilight text-[5vw] sm:text-[18px] text-icy w-[40%] py-[0.6vh] mx-[2vw] -mb-[2vh] font-bold rounded-2xl font-hornbill shadow-lg sm:w-[150px] sm:py-[8px] sm:my-[5px] hover:bg-[#434273] active:bg-[#3b3b66]"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="mt-[2vh] sm:mt-[15px]">
            <Link
              to="/login"
              className="!text-black text-[3.5vw] sm:text-[14px] font-telegraf"
            >
              Already have an account?{" "}
              <u className="text-twilight hover:text-[#7775cc]">Login</u>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
