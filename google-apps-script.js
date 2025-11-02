/**
 * Google Apps Script - Automatic Data Processor
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete the default code and paste this entire file
 * 4. Update the CONFIG section below with your sheet names
 * 5. Save the project
 * 6. Set up a time-driven trigger (Run → Trigger → Add Trigger)
 *    - Function: processFormData
 *    - Event source: Time-driven
 *    - Type: Minutes timer
 *    - Interval: Every 5 or 15 minutes (your choice)
 * 
 * OPTION 1: Export to Clean Sheet Tab
 * - Creates/updates a "Clean_Data" sheet with processed data
 * 
 * OPTION 2: Deploy as Web App
 * - Go to Deploy → New Deployment → Web App
 * - Execute as: Me
 * - Who has access: Anyone (or just you, if you'll add auth)
 * - Click Deploy and copy the Web App URL
 * - Use that URL in your .env.local file
 */

// ========== CONFIGURATION ==========
const CONFIG = {
  // Name of the sheet tab with form responses
  FORM_SHEET_NAME: '[Form] Shift Applications',
  
  // Name of the sheet tab to write clean data to (Option 1)
  CLEAN_SHEET_NAME: 'Clean_Data',
  
  // Master staff list sheet (optional, if you have one)
  STAFF_LIST_SHEET: 'Staff List',
  
  // Enable web app mode (set to true for Option 2)
  WEB_APP_MODE: false,
};

// ========== MAIN PROCESSING FUNCTION ==========
function processFormData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const formSheet = ss.getSheetByName(CONFIG.FORM_SHEET_NAME);
    
    if (!formSheet) {
      Logger.log('Error: Form sheet not found: ' + CONFIG.FORM_SHEET_NAME);
      return;
    }
    
    // Get all form data
    const data = formSheet.getDataRange().getValues();
    if (data.length < 2) {
      Logger.log('No data to process');
      return;
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    // Process the data
    const processed = processRows(headers, rows);
    
    // Export to clean sheet (Option 1)
    if (!CONFIG.WEB_APP_MODE) {
      exportToCleanSheet(ss, processed);
    }
    
    Logger.log('Processed ' + processed.staff.length + ' staff and ' + processed.availability.length + ' availability records');
    
    return processed;
  } catch (error) {
    Logger.log('Error processing data: ' + error.toString());
    throw error;
  }
}

// ========== DATA PROCESSING ==========
function processRows(headers, rows) {
  const staffMap = new Map();
  const availabilityMap = new Map(); // staffName -> Set of dates (only latest submission)
  
  // Find column indices
  const timestampCol = findColumn(headers, 'timestamp');
  const phoneCol = findColumn(headers, 'phone');
  const nameCol = findColumn(headers, 'name', ['中文全名', 'full name']);
  
  // Process rows in REVERSE order to get latest submission first
  // (Google Sheets form responses are usually newest first, but we'll reverse to be safe)
  const reversedRows = rows.slice().reverse();
  
  reversedRows.forEach((row, rowIndex) => {
    if (!row[nameCol]) return; // Skip empty rows
    
    const name = normalizeName(row[nameCol]);
    const phone = row[phoneCol] || '';
    
    if (!name) return;
    
    // Skip if we've already processed this staff member (latest submission wins)
    if (staffMap.has(name) && availabilityMap.has(name)) {
      return; // Already processed - skip older submissions
    }
    
    // Add/update staff (use latest phone number)
    if (!staffMap.has(name)) {
      staffMap.set(name, {
        name: name,
        phone: phone,
      });
    } else if (phone) {
      // Update phone if available
      staffMap.get(name).phone = phone;
    }
    
    // Process availability columns - only if this is the first time we see this staff
    if (!availabilityMap.has(name)) {
      const staffDates = new Set();
      
      headers.forEach((header, colIndex) => {
        if (header.toString().toLowerCase().includes('available') || 
            header.toString().includes('可以返')) {
          const value = row[colIndex] || '';
          if (value && (value.toString().toLowerCase().includes('available') || 
                        value.toString().includes('可以'))) {
            // Extract date from header
            const date = extractDateFromHeader(header.toString());
            if (date) {
              staffDates.add(date);
            }
          }
        }
      });
      
      // Only set if we have dates (latest submission wins)
      if (staffDates.size > 0) {
        availabilityMap.set(name, staffDates);
      }
    }
  });
  
  // Convert Map to array format
  const availabilityList = [];
  for (const [staffName, dates] of availabilityMap.entries()) {
    dates.forEach(date => {
      availabilityList.push({
        staffName: staffName,
        date: date,
      });
    });
  }
  
  return {
    staff: Array.from(staffMap.values()),
    availability: availabilityList,
  };
}

// ========== EXPORT TO CLEAN SHEET (Option 1) ==========
function exportToCleanSheet(ss, processed) {
  let cleanSheet = ss.getSheetByName(CONFIG.CLEAN_SHEET_NAME);
  
  if (!cleanSheet) {
    cleanSheet = ss.insertSheet(CONFIG.CLEAN_SHEET_NAME);
  } else {
    cleanSheet.clear();
  }
  
  // Write staff list
  cleanSheet.getRange(1, 1).setValue('=== STAFF LIST ===');
  cleanSheet.getRange(2, 1, 1, 2).setValues([['Name', 'Phone']]);
  
  const staffData = processed.staff.map(s => [s.name, s.phone || '']);
  if (staffData.length > 0) {
    cleanSheet.getRange(3, 1, staffData.length, 2).setValues(staffData);
  }
  
  // Write availability
  const startRow = 3 + staffData.length + 2;
  cleanSheet.getRange(startRow, 1).setValue('=== AVAILABILITY ===');
  cleanSheet.getRange(startRow + 1, 1, 1, 2).setValues([['Staff Name', 'Date']]);
  
  const availabilityData = processed.availability.map(a => [a.staffName, a.date]);
  if (availabilityData.length > 0) {
    cleanSheet.getRange(startRow + 2, 1, availabilityData.length, 2).setValues(availabilityData);
  }
  
  // Format headers
  const headerRows = [2, startRow + 1];
  headerRows.forEach(row => {
    cleanSheet.getRange(row, 1, 1, 2).setFontWeight('bold').setBackground('#e0e0e0');
  });
}

// ========== WEB APP HANDLER (Option 2) ==========
function doGet(e) {
  try {
    const processed = processFormData();
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        staff: processed.staff,
        availability: processed.availability,
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ========== HELPER FUNCTIONS ==========
function findColumn(headers, keyword, alternatives = []) {
  const searchTerms = [keyword, ...alternatives].map(s => s.toLowerCase());
  
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toString().toLowerCase();
    if (searchTerms.some(term => header.includes(term))) {
      return i;
    }
  }
  return 0; // Default to first column
}

function normalizeName(name) {
  if (!name) return '';
  return name.toString().trim();
}

function extractDateFromHeader(header) {
  // Format: "Available [Mon, Nov 3, 25]"
  const match = header.match(/\[([^\]]+)\]/);
  if (match) {
    return parseDateString(match[1]);
  }
  return null;
}

function parseDateString(dateStr) {
  // Parse "Mon, Nov 3, 25" to "2025-11-03"
  const months = {
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
    'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
    'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
  };
  
  const parts = dateStr.trim().split(',').map(s => s.trim());
  if (parts.length >= 3) {
    const monthName = parts[1].split(' ')[0].toLowerCase();
    const day = parts[1].split(' ')[1];
    const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
    const month = months[monthName] || '01';
    
    return year + '-' + month + '-' + day.padStart(2, '0');
  }
  
  return null;
}

// ========== TEST FUNCTION ==========
function testProcess() {
  const result = processFormData();
  Logger.log('Test result: ' + JSON.stringify(result, null, 2));
}

