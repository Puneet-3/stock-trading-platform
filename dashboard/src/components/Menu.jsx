import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import GeneralContext from "./GeneralContext";

const pages = [
  ["/", "Dashboard"],
  ["/orders", "Orders"],
  ["/holdings", "Holdings"],
  ["/positions", "Positions"],
  ["/funds", "Funds"],
  ["/apps", "Guide"],
];

export default function Menu() {
  const { account, logout } = useContext(GeneralContext);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function signOut() {
    setPending(true);
    try {
      await logout();
    } catch {
      setError("Logout failed. Please retry.");
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="menu-container">
      <nav aria-label="Dashboard navigation">
        {pages.map(([path, label]) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) => (isActive ? "menu selected" : "menu")}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="profile">
        <span>{account.user.name}</span>
        <button onClick={signOut} disabled={pending}>
          {pending ? "Signing out…" : "Log out"}
        </button>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
