export interface Device {
  "Device Name": string;
  Status: string;
  Info?: string; // Optional field
}

export interface SheetData {
  sheetName: string;
  children: Device[];
}

export interface ApiResponse {
  data: SheetData[];
}
