import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

// dont get freak out by this long css
// this is just a template for every textbox on this page
const baseInputClass = `w-full py-[1vh] px-[6%] border rounded-2xl placeholder-gray-300 text-gray-800 
  placeholder:text-[4vw] placeholder:font-telegraf sm:py-[10px] sm:placeholder:text-[14px] 
  transition-all duration-300 ease-in-out hover:border-2 hover:border-pale focus:border 
  focus:border-twilight focus:shadow-inner focus:outline-none`;

function SignUp() {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
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
      // check if user already exists in localStg
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      if (existingUsers.some((user) => user.username === formData.username)) {
        setErrors((prev) => ({
          ...prev,
          username: "Username already exists",
        }));
        return;
      }

      if (existingUsers.some((user) => user.email === formData.email)) {
        setErrors((prev) => ({
          ...prev,
          email: "Email already exists",
        }));
        return;
      }

      const newUser = {
        _id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };

      // save to localStg
      localStorage.setItem(
        "users",
        JSON.stringify([...existingUsers, newUser])
      );

      // save current user (for session)
      const { password, confirmPassword, ...userSession } = newUser;
      localStorage.setItem("currentUser", JSON.stringify(userSession));

      // Redirect to home
      navigate("/home");
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
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 162 158"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M111.713 22.2663C109.455 22.7783 107.37 24.3656 105.653 26.8746C104.91 27.9572 104.768 28.1913 104.295 29.113C102.75 32.0828 101.7 35.3306 101.025 39.244C99.8475 46.0906 100.238 54.7514 102.158 64.1875C102.315 64.9921 102.488 65.7821 102.525 65.9431C102.563 66.104 102.698 66.6965 102.825 67.2597C103.29 69.3005 104.213 72.7605 104.873 74.9549L105.053 75.5474L104.648 76.3081C101.715 81.6992 98.115 87.6388 91.7325 97.5943C90.8475 98.9768 89.6025 100.93 86.325 106.101C85.8375 106.862 85.1925 107.886 84.885 108.369C84.5775 108.852 83.9625 109.825 83.52 110.527C83.07 111.229 82.32 112.407 81.8475 113.146C79.62 116.627 77.91 119.509 77.1075 121.133C76.0125 123.364 76.0125 123.745 77.1075 123.138C80.37 121.345 84.33 116.993 90.9675 107.93C93.1425 104.96 96.225 100.527 97.38 98.7134C97.53 98.472 97.8675 97.96 98.115 97.5796C100.073 94.6025 104.28 87.8436 105.585 85.5833C105.668 85.4443 105.968 84.9323 106.253 84.4495C106.538 83.9668 106.89 83.3669 107.025 83.1109C107.168 82.8622 107.318 82.6574 107.363 82.6574C107.4 82.6574 107.52 82.8768 107.618 83.1475C107.97 84.1423 108.9 86.5416 109.56 88.1435C112.86 96.1898 116.168 102.298 120.015 107.433C123.563 112.173 127.358 115.808 130.905 117.834C131.985 118.456 133.628 119.231 133.86 119.231C133.988 119.231 134.138 119.166 134.235 119.063C134.528 118.763 134.453 118.559 133.823 117.849C133.2 117.169 130.635 114.038 129.435 112.502C125.7 107.718 122.34 102.349 119.16 96.0435C117.225 92.2106 116.16 89.8918 114.525 85.9491C113.618 83.7693 112.598 81.0262 111.608 78.1368L110.925 76.1326L112.38 73.2725C121.305 55.6804 124.56 42.8941 122.588 33.1946C121.845 29.5738 120.33 26.5089 118.275 24.4973C117.12 23.3635 116.205 22.8003 114.863 22.3833C114.195 22.1712 112.418 22.1054 111.713 22.2663ZM113.535 27.5769C113.993 27.7744 114.765 28.5278 115.238 29.2227C117.533 32.6021 118.253 38.0078 117.255 44.3278C116.295 50.3991 113.67 58.0723 109.665 66.5136C108.818 68.2984 108.78 68.3716 108.713 68.3057C108.623 68.218 108.023 65.6724 107.55 63.3463C105.72 54.3856 105.338 46.727 106.395 40.1583C106.958 36.6618 108.195 33.0191 109.598 30.7222C110.595 29.0764 111.788 27.8256 112.65 27.533C113.01 27.4013 113.16 27.4086 113.535 27.5769Z"
                fill="#51508B"
              />
              <path
                d="M66.8625 22.8514C64.9725 23.2903 63.2475 24.7387 61.695 27.1964C59.3925 30.8612 57.57 36.5301 56.7825 42.499C55.905 49.1263 56.1525 55.9875 57.57 64.1875C58.395 68.9933 59.6475 74.1137 61.1325 78.7513L61.5075 79.9216L60.795 81.604C60.075 83.3011 59.6925 84.1862 59.415 84.7787C59.3325 84.9615 59.0625 85.554 58.815 86.0953C58.245 87.3535 57.6375 88.6263 56.3625 91.2523C55.89 92.2178 53.3025 97.2797 52.9875 97.8356C52.8525 98.077 52.4325 98.867 52.05 99.5912C51.6675 100.315 51.1875 101.222 50.9775 101.603C50.775 101.983 50.4225 102.641 50.19 103.066C49.965 103.49 49.65 104.061 49.5 104.346C49.3425 104.624 49.0425 105.187 48.825 105.589C48.495 106.196 47.31 108.347 46.05 110.637C45.8925 110.914 45.135 112.282 44.3625 113.672C42.4875 117.022 42.1425 117.651 41.6025 118.646C41.355 119.107 41.13 119.517 41.1 119.561C40.935 119.773 39.1125 123.416 38.79 124.169C38.19 125.566 37.86 126.576 37.9425 126.788C38.0325 127.014 38.3025 127.205 38.5275 127.205C38.865 127.205 40.5825 125.72 41.715 124.44C43.725 122.172 45.885 119.297 48.6075 115.281C51.285 111.331 52.905 108.771 55.455 104.434C55.8525 103.753 56.175 103.19 56.175 103.175C56.175 103.161 56.2725 102.985 56.385 102.795C56.595 102.444 56.7975 102.086 57.8625 100.14C58.635 98.7353 61.3575 93.4248 61.9725 92.1301C62.2425 91.5668 62.6325 90.7476 62.8425 90.3087C63.0525 89.8771 63.225 89.504 63.225 89.4967C63.225 89.4821 63.3525 89.1968 63.5175 88.8603C63.675 88.5312 63.9 88.0411 64.0125 87.7777C64.125 87.5144 64.2375 87.2803 64.2675 87.2511C64.2975 87.2218 64.5 87.5802 64.725 88.0557C67.4625 93.8637 70.8525 99.0791 74.5275 103.139C75.6675 104.397 76.98 105.633 78.45 106.818C79.7925 107.908 79.95 107.974 80.2875 107.637C80.5275 107.411 80.5275 107.125 80.3025 106.796C80.205 106.657 79.8075 105.948 79.425 105.224C79.0425 104.499 78.0825 102.751 77.2875 101.347C76.5 99.935 75.69 98.4866 75.4875 98.1282C75.2925 97.7625 75.045 97.3236 74.94 97.1407C74.6025 96.5482 72.5625 92.5909 72.1575 91.7424C70.5675 88.4068 69.075 84.8811 67.845 81.5601L67.2975 80.0606L67.44 79.6949C68.3325 77.515 69.8925 73.0164 70.785 70.0759C71.3625 68.1813 72.36 64.4947 72.6 63.3828C72.63 63.2219 72.795 62.4758 72.9675 61.7224C74.1 56.6605 75 50.6697 75.3675 45.7176C75.69 41.4164 75.69 37.2177 75.375 34.1967C74.9025 29.6981 73.59 26.2016 71.685 24.3729C70.5825 23.3123 69.54 22.8441 68.1525 22.7856C67.5675 22.7637 67.1775 22.7856 66.8625 22.8514ZM68.1525 28.5131C69.7125 30.7588 70.4325 35.9962 70.095 42.6453C69.6975 50.4356 68.4375 58.1966 66.3 66.0162C66.0975 66.7696 65.2425 69.6297 64.9725 70.4709C64.7475 71.1585 64.62 71.3194 64.56 70.9756C64.5375 70.8659 64.3875 70.1929 64.215 69.4907C62.67 63.0171 61.86 57.1067 61.755 51.4231C61.68 47.6633 61.905 44.5106 62.475 41.2555C63.3 36.6179 64.905 32.0462 66.585 29.5957C66.9225 29.1056 67.7625 28.162 67.8675 28.162C67.89 28.162 68.0175 28.3156 68.1525 28.5131Z"
                fill="#51508B"
              />
              <path
                d="M40.725 97.4334C37.0275 97.982 32.82 99.957 29.1 102.876C23.325 107.403 19.56 113.168 18.5175 119.049C18.3 120.292 18.2775 122.465 18.465 123.62C19.4775 129.743 24.615 133.049 30.27 131.221C32.1375 130.621 33.945 129.363 34.86 128.031C35.22 127.519 35.2425 127.344 35.01 127.132C34.8675 127.007 34.785 126.993 34.5 127.029C34.0725 127.088 32.685 127.358 31.6125 127.6C29.7 128.024 28.155 128.126 27.0525 127.9C25.3275 127.548 24.0225 126.254 23.475 124.352C23.2725 123.65 23.19 121.901 23.3175 120.951C23.535 119.378 24.3375 117.066 25.2 115.538C25.32 115.318 25.53 114.945 25.665 114.711C25.7925 114.484 26.0325 114.082 26.205 113.819C30.0075 107.886 35.9325 102.839 41.3925 100.879C43.095 100.264 44.3775 100.03 45.6975 100.081C46.38 100.111 46.6275 100.154 47.0325 100.308C47.67 100.564 47.8125 100.557 48.12 100.257C48.54 99.8473 48.4575 99.4523 47.8575 98.9329C46.92 98.1283 45.8175 97.6382 44.3625 97.3968C43.47 97.2505 41.8275 97.2651 40.725 97.4334Z"
                fill="#51508B"
              />
            </svg>
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
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="sm:w-[20px] sm:h-[20px]"
                  >
                    <path
                      d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z"
                      fill="#D6D6D6"
                    />
                  </svg>
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
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[5vw] h-[5vw] max-w-[20px] max-h-[20px] sm:w-[20px] sm:h-[20px]"
                  >
                    <path
                      d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                      fill="#D6D6D6"
                    />
                  </svg>
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="sm:w-[20px] sm:h-[20px]"
                    >
                      <path
                        d="M12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                        fill="#D6D6D6"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="22"
                      height="19"
                      viewBox="0 0 22 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="sm:w-[20px] sm:h-[20px]"
                    >
                      <path
                        d="M10.83 6L14 9.16V9C14 8.20435 13.6839 7.44129 13.1213 6.87868C12.5587 6.31607 11.7956 6 11 6H10.83ZM6.53 6.8L8.08 8.35C8.03 8.56 8 8.77 8 9C8 9.79565 8.31607 10.5587 8.87868 11.1213C9.44129 11.6839 10.2044 12 11 12C11.22 12 11.44 11.97 11.65 11.92L13.2 13.47C12.53 13.8 11.79 14 11 14C9.67392 14 8.40215 13.4732 7.46447 12.5355C6.52678 11.5979 6 10.3261 6 9C6 8.21 6.2 7.47 6.53 6.8ZM1 1.27L3.28 3.55L3.73 4C2.08 5.3 0.78 7 0 9C1.73 13.39 6 16.5 11 16.5C12.55 16.5 14.03 16.2 15.38 15.66L15.81 16.08L18.73 19L20 17.73L2.27 0M11 4C12.3261 4 13.5979 4.52678 14.5355 5.46447C15.4732 6.40215 16 7.67392 16 9C16 9.64 15.87 10.26 15.64 10.82L18.57 13.75C20.07 12.5 21.27 10.86 22 9C20.27 4.61 16 1.5 11 1.5C9.6 1.5 8.26 1.75 7 2.2L9.17 4.35C9.74 4.13 10.35 4 11 4Z"
                        fill="#D6D6D6"
                      />
                    </svg>
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="sm:w-[20px] sm:h-[20px]"
                    >
                      <path
                        d="M12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                        fill="#D6D6D6"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="22"
                      height="19"
                      viewBox="0 0 22 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="sm:w-[20px] sm:h-[20px]"
                    >
                      <path
                        d="M10.83 6L14 9.16V9C14 8.20435 13.6839 7.44129 13.1213 6.87868C12.5587 6.31607 11.7956 6 11 6H10.83ZM6.53 6.8L8.08 8.35C8.03 8.56 8 8.77 8 9C8 9.79565 8.31607 10.5587 8.87868 11.1213C9.44129 11.6839 10.2044 12 11 12C11.22 12 11.44 11.97 11.65 11.92L13.2 13.47C12.53 13.8 11.79 14 11 14C9.67392 14 8.40215 13.4732 7.46447 12.5355C6.52678 11.5979 6 10.3261 6 9C6 8.21 6.2 7.47 6.53 6.8ZM1 1.27L3.28 3.55L3.73 4C2.08 5.3 0.78 7 0 9C1.73 13.39 6 16.5 11 16.5C12.55 16.5 14.03 16.2 15.38 15.66L15.81 16.08L18.73 19L20 17.73L2.27 0M11 4C12.3261 4 13.5979 4.52678 14.5355 5.46447C15.4732 6.40215 16 7.67392 16 9C16 9.64 15.87 10.26 15.64 10.82L18.57 13.75C20.07 12.5 21.27 10.86 22 9C20.27 4.61 16 1.5 11 1.5C9.6 1.5 8.26 1.75 7 2.2L9.17 4.35C9.74 4.13 10.35 4 11 4Z"
                        fill="#D6D6D6"
                      />
                    </svg>
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
                className="bg-twilight text-[5vw] sm:text-[18px] text-icy w-[40%] py-[0.6vh] mx-[2vw] -mb-[2vh] font-bold rounded-2xl font-hornbill shadow-lg sm:w-[150px] sm:py-[8px] sm:my-[5px]"
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
              Already have an account? <u className="!text-twilight">Login</u>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
