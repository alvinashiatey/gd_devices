import "./scss/index.scss";
import { fetchAndUpdateDevices } from "./ts/api";

window.addEventListener("DOMContentLoaded", function () {
  fetchAndUpdateDevices();
});
