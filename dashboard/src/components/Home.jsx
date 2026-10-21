import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import GeneralContext, { GeneralContextProvider } from "./GeneralContext";
import { siteUrl } from "../api";

function AccountHome() {
  const { account, loading, error, reload, notice, setNotice } =
    useContext(GeneralContext);
  const { pathname } = useLocation();
  useEffect(() => {
    setNotice("");
  }, [pathname, setNotice]);
  if (loading)
    return (
      <main className="account-gate" role="status">
        Loading your account…
      </main>
    );
  if (!account)
    return (
      <main className="account-gate">
        <h1>{error ? "Unable to load account" : "Welcome to paper trading"}</h1>
        <p>{error || "Sign in to manage your virtual portfolio."}</p>
        {error && <button onClick={reload}>Retry</button>}
        <a className="btn" href={`${siteUrl}/login`}>
          Log in
        </a>
        <a href={`${siteUrl}/signup`}>Create an account</a>
      </main>
    );
  return (
    <>
      <TopBar />
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
      <Dashboard />
    </>
  );
}

export default function Home() {
  return (
    <GeneralContextProvider>
      <AccountHome />
    </GeneralContextProvider>
  );
}
