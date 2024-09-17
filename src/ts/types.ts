export interface Device {
  "Device Name": string;
  Status: string;
  Info?: string;
}

export interface MonitorSlot {
  "Slots\n ⬇️": string;
  [day: string]: string | undefined;
}

export interface SheetData {
  sheetName: string;
  children: Device[] | MonitorSlot[];
}

export interface ApiResponse {
  data: SheetData[];
}
