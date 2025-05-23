import { Outlet, Route, Routes } from "react-router-dom";
import { Error, SignUp, SignIn } from "./pages";
import { Toaster } from "sonner";
import { GlobalState } from "./store/context";
import { Private } from "./components/private";
import { Links } from "./pages/DashBoard";
import { ShareView } from "./pages/ShareView";
function App() {
  return (
    <>
      <GlobalState>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Error></Error>} />
          <Route
            element={
              <>
                <Private>
                  <Outlet />
                </Private>
              </>
            }
          >
            <Route path="/links" element={<Links />}></Route>
          </Route>
            <Route path="/share/:shareId" element={<ShareView />} />
        </Routes>
        <Toaster richColors />
      </GlobalState>
    </>
  );
}

export default App;
