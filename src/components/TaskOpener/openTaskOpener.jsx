import { createRoot } from "react-dom/client";
import TaskOpener from "./index.jsx"; // импортируем index.jsx

export default function openTaskOpener(props = {}) {
  const container = document.createElement("div");
  container.className = "task-opener-portal";
  document.body.appendChild(container);
  
  const root = createRoot(container);
  
  const cleanup = () => {
    try {
      root.unmount();
    } catch (e) {}
    if (container.parentNode) container.parentNode.removeChild(container);
  };
  
  const propsWithClose = {
    ...props,
    isOpen: true,
    onClose: () => {
      if (typeof props.onClose === "function") props.onClose();
      cleanup();
    }
  };
  
  // ИСПРАВЛЕНО: добавлен JSX внутрь render
  root.render(<TaskOpener {...propsWithClose} />);
  
  return { close: cleanup };
}