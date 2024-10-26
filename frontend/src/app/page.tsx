"use client"
import Landing from "@/components/Landing";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [loading, setloading] = useState(true);
  const [loadingBtn, setloadingBtn] = useState(false);
  const [email, setEmail] = useState("");
  const [Erremail, setErrEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [Errpassword, setErrPassword] = useState(false);
  const [name, setName] = useState("");
  const [Errname, setErrName] = useState(false);
  const [Signup, setSignup] = useState(false);
  const [isDisabledLogin, setisDisabledLogin] = useState(true);
  const [isDisabledSignup, setisDisabledSignup] = useState(true);
  return (
    <div className="flex flex-co">
      {/* <Landing/> */}
      <div className="flex h-screen w-full bg-[#191817] flex-col">
      <h1 className={`mx-32 px-28 hover:cursor-pointer transition-all duration-300 capitalize font-bold text-[1.4rem] tracking-[0.5px] max-sm:mx-0 max-sm:text-xl mt-10`} >Meet for <span className='block-inline text-[#ffaa2b] '> mute</span></h1>

            <div className="flex flex-col w-6/12 justify-center m-auto items-center bg-[#fff] dark:bg-[#191817] h-screen overflow-hidden  max-sm:w-full">
              <div className="flex flex-col w-full h-screen items-center mt-40 max-sm:mt-[7rem] scroll">
                {!Signup ? (
                  <div className="flex flex-col w-7/12 max-sm:w-10/12">
                    <div className="flex flex-col">
                      <h1
                        // style={{ fontFamily: "YourFontMedium" }}
                        className=" text-3xl font-[600] tracking-[0.4px] max-sm:text-center"
                      >
                        Create an account
                      </h1>
                      {/* <h1 className="text-sm pt-2 font-[100] text-[#a5a5a5] tracking-[0.5px] pb-1 ">Enter your email below to create your account</h1> */}
                    </div>
                    <form className="flex flex-col mt-10 z-[200]">
                      <h1 className="text-sm pt-2 font-[100] dark:text-[#a5a5a5] text-[#333] tracking-[0.5px] pb-1 ">
                        Email Address{" "}
                      </h1>
                      <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value), setErrEmail(false);
                        }}
                        className={`${
                          Erremail
                            ? "text-red-400 border-red-700 outline-red-700"
                            : "outline-none"
                        } p-3 mb-2 rounded dark:bg-[#1e1c1a] border `}
                      />
                      <h1 className="text-sm pt-2 font-[100] dark:text-[#a5a5a5] text-[#333] tracking-[0.5px] pb-1 ">
                        Create Password{" "}
                      </h1>
                      <input
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value), setErrPassword(false);
                        }}
                        className={`${
                          Errpassword
                            ? "text-red-400 border-red-700"
                            : "outline-none"
                        } p-3 mb-2 rounded dark:bg-[#1e1c1a] border `}
                      />
                      <h1 className="text-sm pt-2 font-[100] dark:text-[#a5a5a5] text-[#333] tracking-[0.5px] pb-1 ">
                        Username{" "}
                      </h1>
                      <input
                        type="text"
                        placeholder="JohnWick"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value), setErrName(false);
                        }}
                        className={`${
                          Errname
                            ? "text-red-400 border-red-700"
                            : "outline-none"
                        } p-3 mb-2 rounded dark:bg-[#1e1c1a] border `}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          // register();
                          setloadingBtn(true);
                          setisDisabledSignup(true);
                        }}
                        disabled={isDisabledSignup}
                        className={`${
                          isDisabledSignup
                            ? "cursor-not-allowed opacity-80 text-[#ffffff] bg-[#263238] dark:text-[#ffffff] dark:bg-[#263238]"
                            : "text-[#ffffff] bg-[#263238] dark:bg-[#ffffff] dark:text-[#263238]"
                        } p-2 my-2 rounded text-[600] transition-all duration-500`}
                      >
                        {loadingBtn ? "Processing..." : "Create Account"}
                      </button>
                    </form>
                    <h1 className="text-xs py-1 flex justify-end underline underline-offset-4 dark:text-[#a5a5a5] text-[#333] z-[200]">
                      <p
                        // onClick={() => handleSignup()}
                        className="cursor-pointer"
                      >
                        Already have an account?
                      </p>
                    </h1>
                    {/* <button >Notify !</button> */}
                  </div>
                ) : (
                  <div className="flex flex-col w-7/12 max-sm:w-10/12">
                    <div className="flex flex-col">
                      <h1
                        // style={{ fontFamily: "YourFontMedium" }}
                        className=" text-3xl font-[600] tracking-[0.4px] max-sm:text-center"
                      >
                        Login
                      </h1>
                      {/* <h1 className="text-sm pt-2 font-[100] text-[#a5a5a5] tracking-[0.5px] pb-1 ">Enter your email below to create your account</h1> */}
                    </div>
                    <form className="flex flex-col mt-10 z-[200]">
                      <h1 className="text-sm pt-2 font-[100] dark:text-[#a5a5a5] text-[#333] tracking-[0.5px] pb-1 ">
                        Email Address{" "}
                      </h1>
                      <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value), setErrEmail(false);
                        }}
                        className={`${
                          Erremail
                            ? "text-red-400 border-red-700"
                            : "outline-none"
                        } p-3 mb-2 rounded dark:bg-[#1e1c1a] border `}
                      />
                      <h1 className="text-sm pt-2 font-[100] dark:text-[#a5a5a5] text-[#333] tracking-[0.5px] pb-1 ">
                        Password{" "}
                      </h1>
                      <input
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value), setErrPassword(false);
                        }}
                        className={`${
                          Errpassword
                            ? "text-red-400 border-red-700"
                            : "outline-none"
                        } p-3 mb-2 rounded dark:bg-[#1e1c1a] border `}
                      />
                      <h1
                        className={`${
                          Errpassword ? "" : "hidden"
                        } text-xs py-1 flex justify-end underline underline-offset-4 dark:text-[#a5a5a5] text-[#333] z-[200]`}
                      >
                        <p
                          // onClick={() => handleForgetPassword()}
                          className="cursor-pointer"
                        >
                          forget password?
                        </p>
                      </h1>

                      <button
                        type="button"
                        onClick={() => {
                          // login(email, password);
                          setloadingBtn(true);
                          setisDisabledLogin(true);
                        }}
                        disabled={isDisabledLogin}
                        className={`${
                          isDisabledLogin
                            ? "cursor-not-allowed opacity-80 text-[#ffffff] bg-[#263238]"
                            : "text-[#ffffff] bg-[#263238] dark:bg-[#ffffff] dark:text-[#263238]"
                        } p-2 my-2 rounded text-[600] transition-all duration-500`}
                      >
                        {loadingBtn ? "Processing..." : "Login"}
                      </button>
                    </form>
                    <h1 className="text-xs py-1 flex justify-end underline underline-offset-4 dark:text-[#a5a5a5] text-[#333] z-[200]">
                      <p
                        // onClick={() => handleSignup()}
                        className="cursor-pointer"
                      >
                        dont have an account?
                      </p>
                    </h1>
                  </div>
                )}

                {/* <div className="flex flex-col w-7/12 mb-10 max-sm:w-10/12">
                  <h1 className="text-center dark:text-[#a5a5a5] text-[#333] p-4">
                    or continue with
                  </h1>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      // onClick={handleGoogle}
                      className="p-2 my-2 rounded bg-[#ffffff] dark:bg-[#191817] text-[600] flex justify-center border backdrop-blur-[10px] "
                    >
                      <Image
                        src={"/google.png"}
                        height={10}
                        width={1000}
                        alt=""
                        className="h-6 w-6 mx-2"
                      />{" "}
                      Google
                    </button>
                    <button
                      type="button"
                      // onClick={handleGithub}
                      className="p-2 my-2 rounded bg-[#ffffff] dark:bg-[#191817] text-[600] flex justify-center border backdrop-blur-[10px] "
                    >
                      <Image
                        src={"/GitHub.png"}
                        height={10}
                        width={1000}
                        alt=""
                        className="h-6 w-6 mx-2"
                      />{" "}
                      Github
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
    </div>
  );
}
