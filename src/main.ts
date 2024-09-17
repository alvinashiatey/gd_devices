import "./scss/index.scss";
import { fetchAndUpdateData } from "./ts/api";

window.addEventListener("DOMContentLoaded", function () {
  fetchAndUpdateData();
});
