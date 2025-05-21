import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../store/context";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function Private({ children }: { children: React.ReactNode }) {
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  let { isAuthenticated } = useContext(authContext);
  useEffect(() => {
    console.log("is authenticated", isAuthenticated);
    if (isAuthenticated === false) {
      toast.error("user is not authenticated"); // why my toast is not appearing here ??
      setTimeout(() => {
        navigate("/signin");
      }, 500);
      return;
    } else {
      setLoading(false);
    }
  }, []);

  return <>{loading ? "loading ..." : children} </>;
}
