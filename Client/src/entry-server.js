// src/entry-server.js
import { renderToString } from "react-dom/server";
import { createApp } from "./main";

export async function render(url, context) {
  const { app } = createApp();
  const html = renderToString(app);
  return { html };
}
