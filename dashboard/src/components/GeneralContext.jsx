import React, { useCallback, useEffect, useRef, useState } from "react";
import { request } from "../api";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext(null);

export function GeneralContextProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [notice, setNotice] = useState("");
  const loadId = useRef(0);

  const reload = useCallback(async () => {
    const id = ++loadId.current;
    setLoading(true);
    setError("");
    try {
      const [nextAccount, nextQuotes] = await Promise.all([
        request("/account"),
        request("/quotes"),
      ]);
      if (id === loadId.current) {
        setAccount(nextAccount);
        setQuotes(nextQuotes);
      }
    } catch (err) {
      if (id === loadId.current) {
        setAccount(null);
        setError(
          err.status === 401
            ? ""
            : "Could not load your account. Check that the API is running and try again.",
        );
      }
    } finally {
      if (id === loadId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem("token");
    reload();
    return () => {
      loadId.current += 1;
    };
  }, [reload]);

  async function mutate(path, body, key) {
    const id = loadId.current;
    try {
      const result = await request(path, { body, key });
      if (id !== loadId.current)
        throw Object.assign(
          new Error("Your session changed. Please sign in again."),
          { status: 401 },
        );
      setAccount(result);
      return result;
    } catch (err) {
      if (err.status === 401 && id === loadId.current) {
        setAccount(null);
        setOrder(null);
      }
      throw err;
    }
  }

  async function logout() {
    try {
      await request("/logout", { body: {} });
    } catch (err) {
      if (err.status !== 401) throw err;
    }
    loadId.current += 1;
    setAccount(null);
    setOrder(null);
    setNotice("");
  }

  return (
    <GeneralContext.Provider
      value={{
        account,
        quotes,
        loading,
        error,
        reload,
        mutate,
        logout,
        notice,
        setNotice,
        openOrder: (quote, mode) => {
          setNotice("");
          setOrder({ quote, mode });
        },
      }}
    >
      {children}
      {account && order && (
        <BuyActionWindow
          key={`${order.quote.name}-${order.mode}`}
          {...order}
          onClose={() => setOrder(null)}
        />
      )}
    </GeneralContext.Provider>
  );
}

export default GeneralContext;
