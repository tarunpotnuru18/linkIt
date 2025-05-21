import React, { useContext, useState } from "react";
import { Eye, EyeOff, Circle, CircleCheck, CircleX } from "lucide-react";
import { toast } from "sonner";
import z from "zod";
import { Link } from "react-router-dom";
import { authContext } from "../store/context";
export function SignUp() {
  let [userName, setUserName] = useState<string>("");
  let [email, setEmail] = useState<string>("");
  let [password, setPassword] = useState<string>("");
  let [showPassword, setShowPassword] = useState<boolean>(false);
  let [emailError, setEmailError] = useState("");
  let [userNameError, setUserNameError] = useState("");
  let { setAuthenticated } = useContext(authContext);
  interface signUpRequest {
    userName: string;
    email: string;
    password: string;
  }
  interface signUpResponse {
    success: boolean;
    message?: string;
  }

  async function signUp({
    userName,
    password,
    email,
  }: signUpRequest): Promise<string> {
    try {
      let response = await fetch(`${import.meta.env.VITE_API_URL}signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userName, email, password }),
      });

      let data: signUpResponse = await response.json();
      console.log(data);
      if (data.success) {
        setAuthenticated(true);
        return "signup Successful";
      } else {
        throw new Error(data?.message || "signup failed");
      }
    } catch (error) {
      console.log("error from signup", error);
      throw new Error("signup failed");
    }
  }

  function PasswordValidator({ password }: { password: string }) {
    let lengthCheck = z.string().min(5).safeParse(password).success;
    let alphabetCheck = z
      .string()
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .safeParse(password).success;
    let numberCheck = z.string().regex(/[0-9]/).safeParse(password).success;
    let symbolCheck = z.string().regex(/[@*]/).safeParse(password).success;

    return (
      <div className="flex flex-col my-[10px]">
        <div
          className={`${
            lengthCheck ? "text-green-400" : "text-gray-400"
          } flex gap-3 items-center`}
        >
          {lengthCheck ? <CircleCheck size={15} /> : <Circle size={15} />}
          Minimum 5 characters long
        </div>

        <div
          className={`${
            alphabetCheck ? "text-green-400" : "text-gray-400"
          } flex gap-3 items-center`}
        >
          {alphabetCheck ? <CircleCheck size={15} /> : <Circle size={15} />}
          Mix of uppercase & lowercase letters
        </div>
        <div
          className={`${
            numberCheck ? "text-green-400" : "text-gray-400"
          } flex gap-3 items-center`}
        >
          {numberCheck ? <CircleCheck size={15} /> : <Circle size={15} />}
          Contain at least 1 number
        </div>
        <div
          className={`${
            symbolCheck ? "text-green-400" : "text-gray-400"
          } flex gap-3 items-center`}
        >
          {symbolCheck ? <CircleCheck size={15} /> : <Circle size={15} />}
          Contain at least one among these [@ *]
        </div>
      </div>
    );
  }

  function emailValidator(email: string): boolean {
    let emailFormat = z.string().email({ message: "invalid email format" });
    let emailFormatCheck = emailFormat.safeParse(email);

    if (emailFormatCheck.success === false) {
      setEmailError(emailFormatCheck.error.issues[0].message);
    } else {
      setEmailError("");
    }
    return emailFormatCheck.success;
  }
  function UserNameValidator(userName: string): boolean {
    let userNameFormat = z
      .string()
      .min(5, { message: " username should be minimum of 5 characters long" })
      .regex(/^[a-zA-Z0-9._-]+$/, {
        message: "Username can only contain letters, numbers, '.', '_' and '-'",
      });

    let userNameFormatCheck = userNameFormat.safeParse(userName);

    if (userNameFormatCheck.success === false) {
      console.log(userNameFormatCheck.error.issues[0]);
      setUserNameError(userNameFormatCheck.error.issues[0].message);
    } else {
      setUserNameError("");
    }
    return userNameFormatCheck.success;
  }
  function credentialChecker({
    userName,
    password,
    email,
  }: signUpRequest): boolean {
    let emailFormatCheck = emailValidator(email);
    let userNameFormatCheck = UserNameValidator(userName);
    let passwordFormat = z
      .string()
      .min(5)
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .regex(/[@*]/);

    let passwordFormatCheck = passwordFormat.safeParse(password);

    return (
      userNameFormatCheck && emailFormatCheck && passwordFormatCheck.success
    );
  }

  function toastGenerator(
    fn: (payload: signUpRequest) => Promise<string>,
    { email, password, userName }: signUpRequest
  ) {
    toast.promise(fn({ email, password, userName }), {
      loading: "signing up ...",
      success: (s: string) => {
        return s;
      },
      error: (e: Error) => {
        return e.message;
      },
    });
  }

  return (
    <>
      <div className="min-h-screen  flex flex-col pt-[25px] items-center bg-[#0f0f0f] text-white ">
        <div className="flex flex-col gap-[15px] items-center justify-center w-full p-[20px] text-3xl font-extrabold font-manrope tracking-tighter">
          LINKIT.
          <p className="font-normal text-[20px] tracking-normal">
            welcome,create your account
          </p>
        </div>
        <form
          action=""
          method=""
          className="p-[15px] px-[30px] border-[#262626] rounded-lg border-1 flex flex-col bg-[#171717] lg:min-w-[520px]"
        >
          <div className="mt-[5px] flex flex-col gap-[4px]">
            <label htmlFor={"name"} className="font-medium tracking-wide">
              Username
            </label>
            <input
              type="text"
              id="name"
              name="user_name"
              value={userName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUserName(() => e.target.value);
                if (userNameError && UserNameValidator(e.currentTarget.value)) {
                  setUserNameError("");
                }
              }}
              className="w-full border border-gray-500 rounded-sm focus:outline-2 focus:outline-gray-400 py-[3px] px-[5px]  bg-[#0f0f0f] "
              placeholder="enter your username here"
            />
            <div className="username-error-msg h-[25px] text-red-600 text-[13px] flex items-center">
              {userNameError && (
                <>
                  <CircleX size={13} className="mr-[5px]" /> {userNameError}
                </>
              )}
            </div>
          </div>
          <div className="mt-[5px] flex flex-col gap-[4px]">
            <label htmlFor="mail" className="">
              Email
            </label>
            <input
              type="email"
              id="mail"
              required
              name="user_email"
              placeholder="enter your email here"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                if (emailError && emailValidator(e.currentTarget.value)) {
                  //levaraged the short circuit operator becaause if i dont use that for every change the email validtor executes which we dont wnat because we only want to chnage the message if tehre is error already
                  setEmailError("");
                }
              }}
              className="w-full border border-gray-500 rounded-sm focus:outline-2 focus:outline-gray-400 py-[3px] pl-[5px] bg-[#0f0f0f] "
            />
            <div className="email-error-msg h-[25px] text-red-600 text-[13px] flex items-center">
              {emailError && (
                <>
                  <CircleX size={15} className="mr-[5px]" /> {emailError}
                </>
              )}
            </div>
          </div>
          <div className="mt-[5px] flex flex-col gap-[4px]">
            <label htmlFor="password" className="mr-[5px]">
              Password
            </label>

            <div className="flex border-gray-500 bg-[#0f0f0f] border rounded-sm focus-within:outline-2 focus-within:outline-gray-400">
              <input
                type={showPassword ? "type" : "password"}
                id="password"
                name="user_message"
                placeholder="enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
                className="w-full border bg-transparent  py-[3px] pl-[5px] focus:outline-0 border-none "
              />
              <button
                type="button"
                className=" cursor-pointer px-[5px] hover:text-amber-300"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <PasswordValidator password={password}></PasswordValidator>
          <button
            type="submit"
            className="w-full border-gray-500 border py-[3px] rounded-lg flex items-center justify-center bg-[#0f0f0f] hover:bg-transparent cursor-pointer"
            onClick={(e: React.FormEvent) => {
              e.preventDefault();

              if (credentialChecker({ userName, password, email }) === false) {
                return;
              }
              toastGenerator(signUp, { userName, email, password });
            }}
          >
            Sign Up
          </button>
          <div className="flex items-center justify-center mt-[10px]">
            already have an account?{" "}
            <Link
              to={"/signin"}
              className=" text-green-300 hover:text-amber-200 ml-[5px]"
            >
              sign in
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
