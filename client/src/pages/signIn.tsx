import React, { useState, useContext } from "react";
import z from "zod";
import { Eye, EyeOff, CircleX } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { authContext } from "../store/context";
export function SignIn() {
  let [email, setEmail] = useState<string>("");
  let [password, setPassword] = useState<string>("");
  let [showPassword, setShowPassword] = useState<boolean>(false);
  let [emailError, setEmailError] = useState("");
  let { setAuthenticated } = useContext(authContext);
  // let navigate = useNavigate();
  interface signInRequest {
    email: string;
    password: string;
  }

  interface signInResponse {
    success: boolean;
    message?: string;
  }

  async function signIn({ email, password }: signInRequest): Promise<string> {
    try {
      let response = await fetch(`${import.meta.env.VITE_API_URL}signin`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      let data: signInResponse = await response.json();
      console.log(data);
      if (data.success) {
        setAuthenticated(true);
        return "signin successful";
      } else {
        throw data;
      }
    } catch (error) {
      console.log("error from signin", error);

      throw new Error("signIn failed 😔");
      /*
       one of the important thing we have to remember is, by default the async funtion returns a promise
       and if you return anything from the aysnc funtion it means you are resolving the promise returned by the aysnc function and to make sure 
       the promise returned by the async function is rejected in error cause you have to throw an error or you have to call Promise.reject(<desired value>)
      */
    }
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
  function toastGenerator(
    fn: (payload: signInRequest) => Promise<string>,
    { email, password }: signInRequest
  ) {
    toast.promise(fn({ email, password }), {
      loading: "signing in ...",
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
      <div className="min-h-screen w-screen flex flex-col pt-[25px] items-center bg-[#0f0f0f] text-white ">
        <div className="flex flex-col gap-[15px] items-center justify-center w-full p-[20px] text-3xl font-extrabold font-manrope tracking-tighter">
          LINKIT.
          <p className="font-normal text-[20px] tracking-normal">
            Welcome Back
          </p>
        </div>
        <form
          action=""
          method=""
          className="p-[15px] px-[30px] border-[#262626] rounded-lg border-1 flex flex-col bg-[#171717] lg:min-w-[520px]"
        >
          <div className="mt-[5px] flex flex-col gap-[4px]">
            <label htmlFor="mail" className="">
              Email
            </label>
            <input
              type="email"
              id="mail"
              name="user_email"
              placeholder="enter your email here"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                if (emailError && emailValidator(e.target.value)) {
                  setEmailError("");
                }
              }}
              className="w-full border border-gray-500 rounded-sm focus:outline-2 focus:outline-gray-400 py-[3px] pl-[5px] bg-[#0f0f0f] "
            />
            <div className="email-error-msg h-[25px] flex items-center text-red-500 text-[13px]">
              {emailError && (
                <>
                  <CircleX size={15} className="mr-[5px]" /> {emailError}
                </>
              )}
            </div>
          </div>
          <div className="mt-[5px] flex flex-col gap-[4px]">
            <label htmlFor="password" className="">
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
            <div className="email-error-msg h-[25px]"></div>
          </div>
          <button
            type="submit"
            className="w-full border-gray-500 border py-[3px] rounded-lg flex items-center justify-center bg-[#0f0f0f] hover:bg-transparent cursor-pointer active:ring"
            onClick={(e: React.FormEvent) => {
              e.preventDefault();
              if (emailValidator(email) === false) {
                return;
              }
              toastGenerator(signIn, { email, password });
            }}
          >
            Sign in
          </button>
          <div className="flex items-center justify-center mt-[10px]">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className=" text-green-300 hover:text-amber-200 ml-[5px]"
            >
              sign up
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
