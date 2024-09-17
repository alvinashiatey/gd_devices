// src/main.ts

import { ApiResponse, Device } from "./types";

// Function to fetch JSON data and update the HTML
async function fetchAndUpdateDevices() {
  const url =
    "https://script.google.com/macros/s/AKfycbwnFvyuE4rdA59_gb8kqNbI313Z3UspWAsm2GwB-cayGvSOID6fuaevax7eo4nJ_5mmKA/exec";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    console.log(data); // For debugging purposes
    updateDeviceStatus(data); // Call function to update the HTML
  } catch (error) {
    console.error("Error fetching the JSON data:", error);
    displayGlobalError("Failed to load device data.");
  }
}

function displayGlobalError(message: string) {
  const container = document.querySelector("main");
  if (container) {
    const errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    errorMsg.textContent = message;
    container.appendChild(errorMsg);
  }
}

function updateDeviceStatus(apiResponse: ApiResponse) {
  apiResponse.data.forEach((sheet) => {
    sheet.children.forEach((device) => {
      const deviceId = device["Device Name"].toLowerCase(); // Assuming IDs are lowercase
      const deviceElement = document.getElementById(deviceId);

      if (deviceElement) {
        let statusInfoContainer = deviceElement.querySelector(
          ".status-info"
        ) as HTMLElement;

        if (!statusInfoContainer) {
          statusInfoContainer = document.createElement("div");
          statusInfoContainer.classList.add("status-info");
          deviceElement.appendChild(statusInfoContainer);
        }

        statusInfoContainer.innerHTML = "";

        const statusElement = document.createElement("p");
        statusElement.classList.add("status");
        statusElement.textContent = `Status: ${device["Status"]}`;
        statusElement.style.color = getStatusColor(device["Status"]);
        statusInfoContainer.appendChild(statusElement);

        if (device.Info) {
          const infoElement = document.createElement("p");
          infoElement.classList.add("info");
          infoElement.textContent = `Info: ${device.Info}`;
          statusInfoContainer.appendChild(infoElement);
        }
      } else {
        console.warn(`No HTML element found with ID: ${deviceId}`);
      }
    });
  });
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "up":
      return "green";
    case "down":
      return "red";
    case "under maintenance":
      return "orange";
    default:
      return "black";
  }
}

export { fetchAndUpdateDevices };
