// src/main.ts

import { ApiResponse, Device, MonitorSlot } from "./types";

// Function to fetch JSON data and update the HTML
async function fetchAndUpdateData() {
  const url =
    "https://script.google.com/macros/s/AKfycbx18giy-YKBJOlwyHE69ee2wM3lk0Qh4QAeJoJh_kaglg_acVlWiLrzehiYJj4Ua8-uiA/exec";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    console.log(data); // For debugging purposes
    processData(data); // Process and display the data
  } catch (error) {
    console.error("Error fetching the JSON data:", error);
    displayGlobalError("Failed to load data.");
  }
}

// Function to display a global error message
function displayGlobalError(message: string) {
  const container = document.querySelector("main");
  if (container) {
    const errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    errorMsg.textContent = message;
    container.appendChild(errorMsg);
  }
}

// Function to process and display data based on sheet names
function processData(apiResponse: ApiResponse) {
  apiResponse.data.forEach((sheet) => {
    console.log(sheet.sheetName); // For debugging purposes
    if (sheet.sheetName === "Devices") {
      displayDevices(sheet.children as Device[]);
    } else if (sheet.sheetName === "Monitors") {
      displayCurrentMonitor(sheet.children as MonitorSlot[]);
    }
  });
}

// Function to display Devices
function displayDevices(devices: Device[]) {
  const container = document.getElementById("device-container");
  if (!container) {
    console.error("Device container not found");
    return;
  }

  devices.forEach((device) => {
    const deviceId = device["Device Name"].toLowerCase(); // Ensure IDs are lowercase
    const deviceElement = document.getElementById(deviceId);

    if (deviceElement) {
      // Create a container for status and info
      let statusInfoContainer = deviceElement.querySelector(
        ".status-info"
      ) as HTMLElement;

      // If the container doesn't exist, create it
      if (!statusInfoContainer) {
        statusInfoContainer = document.createElement("div");
        statusInfoContainer.classList.add("status-info");
        deviceElement.appendChild(statusInfoContainer);
      }

      // Clear previous content
      statusInfoContainer.innerHTML = "";

      // Create and append status element
      const statusElement = document.createElement("p");
      statusElement.classList.add("status");
      statusElement.textContent = `Status: ${device["Status"]}`;
      statusElement.style.color = getStatusColor(device["Status"]);
      statusInfoContainer.appendChild(statusElement);

      // If there's additional info, create and append it
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
}

// Helper function to determine color based on status
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

// Function to parse time strings like "9:00am" to Date objects
function parseTime(timeStr: string): Date {
  const now = new Date();
  const [time, modifier] = timeStr
    .match(/(\d{1,2}:\d{2})(am|pm)/i)!
    .slice(1, 3);
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier.toLowerCase() === "pm" && hours !== 12) {
    hours += 12;
  }
  if (modifier.toLowerCase() === "am" && hours === 12) {
    hours = 0;
  }

  const parsedTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );
  return parsedTime;
}

// Function to check if current time is within a slot
function isCurrentTimeInSlot(slot: string): boolean {
  const [startStr, endStr] = slot.split(" - ").map((s) => s.trim());
  const startTime = parseTime(startStr);
  const endTime = parseTime(endStr);

  const now = new Date();

  return now >= startTime && now < endTime;
}

function displayCurrentMonitor(slots: MonitorSlot[]) {
  const container = document.getElementById("current-monitor-container");
  if (!container) {
    console.error("Current Monitor container not found");
    return;
  }

  // Clear any existing content
  container.innerHTML = "";

  const now = new Date();
  const currentDay = now
    .toLocaleString("en-US", { weekday: "long" })
    .toUpperCase();

  // Find all slots that include the current time
  const currentSlots = slots.filter((slot) =>
    isCurrentTimeInSlot(slot["Slots\n ⬇️"])
  );

  if (currentSlots.length === 0) {
    const noMonitorMsg = document.createElement("p");
    noMonitorMsg.textContent = "No monitors are currently available.";
    container.appendChild(noMonitorMsg);
    return;
  }

  // Collect monitors from current slots
  const monitors: string[] = [];
  currentSlots.forEach((slot) => {
    const monitor = slot[currentDay];
    if (monitor) {
      monitors.push(monitor);
    }
  });

  if (monitors.length === 0) {
    const noMonitorMsg = document.createElement("p");
    noMonitorMsg.innerHTML =
      'No monitors are currently available. Reach out to <a href="mailto:alvin.ashiatey@yale.edu">Alvin</a> for assistance.';
    container.appendChild(noMonitorMsg);
    return;
  }

  // Create a list of current monitors
  const monitorList = document.createElement("div");
  monitors.forEach((monitor) => {
    const listItem = document.createElement("p");
    listItem.textContent = monitor;
    monitorList.appendChild(listItem);
  });

  // Append the list to the container
  container.appendChild(monitorList);
}

// Initialize the fetch when the DOM is fully loaded
export { fetchAndUpdateData };
