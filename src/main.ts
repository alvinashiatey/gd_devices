import "./scss/index.scss";
import "./ts/riso-theme";
import "./ts/paper-stack.ts";
import { fetchAndUpdateData } from "./ts/api";

window.addEventListener("DOMContentLoaded", () => {
  fetchAndUpdateData();
});
