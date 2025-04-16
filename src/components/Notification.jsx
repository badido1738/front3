import { useEffect, useState } from "react";
import "../layout/layout.css";

export default function Notification({ message, type = "info" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
}