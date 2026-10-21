import React from "react";
import Menu from "./Menu";

export default function TopBar() {
  return (
    <header className="topbar-container">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="brand">
        Paper Trading<small>Sample quotes · Virtual funds</small>
      </div>
      <Menu />
    </header>
  );
}
