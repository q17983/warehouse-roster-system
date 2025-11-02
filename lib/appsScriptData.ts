/**
 * Fetch cleaned data from Google Apps Script
 * Supports two methods:
 * 1. Web App URL (JSON endpoint)
 * 2. CSV/JSON export from Clean_Data sheet (via public CSV link)
 */

export interface CleanStaffData {
  name: string;
  phone?: string;
}

export interface CleanAvailabilityData {
  staffName: string;
  date: string; // YYYY-MM-DD format
}

export interface CleanDataResponse {
  success: boolean;
  timestamp?: string;
  staff: CleanStaffData[];
  availability: CleanAvailabilityData[];
  error?: string;
}

/**
 * Fetch data from Apps Script Web App (Option 1)
 */
export async function fetchFromWebApp(webAppUrl: string): Promise<CleanDataResponse> {
  try {
    const response = await fetch(webAppUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching from Apps Script Web App:', error);
    return {
      success: false,
      staff: [],
      availability: [],
      error: error.message || 'Failed to fetch data',
    };
  }
}

/**
 * Fetch data from Google Sheets CSV export (Option 2)
 * 
 * To get the CSV URL:
 * 1. Make your Google Sheet "Anyone with the link can view"
 * 2. Go to File → Share → Publish to web → CSV
 * 3. Or use: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/gviz/tq?tqx=out:csv&sheet=CLEAN_SHEET_NAME
 */
export async function fetchFromCSV(csvUrl: string): Promise<CleanDataResponse> {
  try {
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return {
        success: false,
        staff: [],
        availability: [],
        error: 'No data found in CSV',
      };
    }
    
    const staff: CleanStaffData[] = [];
    const availability: CleanAvailabilityData[] = [];
    
    let section = '';
    let headers: string[] = [];
    
    for (const line of lines) {
      const row = parseCSVLine(line);
      
      // Detect section headers
      if (row[0] && row[0].includes('STAFF LIST')) {
        section = 'staff';
        continue;
      } else if (row[0] && row[0].includes('AVAILABILITY')) {
        section = 'availability';
        continue;
      }
      
      // Skip empty rows
      if (row.length === 0 || !row[0]) continue;
      
      // Detect header rows
      if (row[0].toLowerCase() === 'name' || row[0].toLowerCase() === 'staff name') {
        headers = row;
        continue;
      }
      
      // Parse staff data
      if (section === 'staff' && headers.length >= 2) {
        const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name'));
        const phoneIndex = headers.findIndex(h => h.toLowerCase().includes('phone'));
        
        if (nameIndex >= 0 && row[nameIndex]) {
          staff.push({
            name: row[nameIndex].trim(),
            phone: phoneIndex >= 0 ? row[phoneIndex]?.trim() : undefined,
          });
        }
      }
      
      // Parse availability data
      if (section === 'availability' && headers.length >= 2) {
        const nameIndex = headers.findIndex(h => h.toLowerCase().includes('staff') || h.toLowerCase().includes('name'));
        const dateIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
        
        if (nameIndex >= 0 && dateIndex >= 0 && row[nameIndex] && row[dateIndex]) {
          const date = normalizeDate(row[dateIndex].trim());
          if (date) {
            availability.push({
              staffName: row[nameIndex].trim(),
              date: date,
            });
          }
        }
      }
    }
    
    return {
      success: true,
      staff,
      availability,
    };
  } catch (error: any) {
    console.error('Error fetching from CSV:', error);
    return {
      success: false,
      staff: [],
      availability: [],
      error: error.message || 'Failed to fetch CSV data',
    };
  }
}

/**
 * Simple CSV line parser (handles quoted fields)
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

/**
 * Normalize date to YYYY-MM-DD format
 */
function normalizeDate(dateStr: string): string | null {
  if (!dateStr) return null;
  
  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Try DD/MM/YYYY
  const ddmmyyyy = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    return `${year}-${month}-${day}`;
  }
  
  // Try parsing with Date
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    // ignore
  }
  
  return null;
}

/**
 * Main function to fetch data (tries Web App first, falls back to CSV)
 */
export async function fetchCleanData(webAppUrl?: string, csvUrl?: string): Promise<CleanDataResponse> {
  // Try Web App first if URL provided
  if (webAppUrl) {
    const result = await fetchFromWebApp(webAppUrl);
    if (result.success) {
      return result;
    }
    console.warn('Web App fetch failed, trying CSV fallback...');
  }
  
  // Fall back to CSV if provided
  if (csvUrl) {
    return await fetchFromCSV(csvUrl);
  }
  
  return {
    success: false,
    staff: [],
    availability: [],
    error: 'No data source configured. Provide either APPS_SCRIPT_WEB_APP_URL or CSV_URL',
  };
}

