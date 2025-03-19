import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

function SignUp() {
  return (
    <>
      <img
        src={logo}
        className="size-35 absolute top-15 left-1/2 transform -translate-x-1/2 mt-4 sm:size-25 sm:left-0 sm:translate-x-0 sm:m-4 sm:top-0"
        alt=""
      />
      <h1 className="font-hornbill text-[#51508B] relative bottom-25">
        Debt Mate
      </h1>

      <div>
        <div className="bg-white relative bottom-12 p-8 rounded-lg shadow-lg ">
          <form action="" className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 border border-gray-300 rounded-lg "
              />
            </div>

            {/* temp button to test routhing before the ui set up*/}
            <div className="pt-4">
              <Link to="/login">Temp btn to Login pg</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
