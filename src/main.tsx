import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error("Root element not found");

  const root = createRoot(rootElement);
  root.render(<App />);
} catch (e: any) {
  console.error("Boot error:", e);
  const div = document.createElement("div");
  div.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#800;color:white;padding:20px;z-index:10000;font-family:monospace;white-space:pre-wrap;overflow:auto;";
  div.innerHTML = "<h1>CRITICAL BOOT ERROR</h1>" +
    "<b>Message:</b> " + e.message + "<br/><br/>" +
    "<b>Stack:</b><br/>" + e.stack;
  document.body.appendChild(div);
}
