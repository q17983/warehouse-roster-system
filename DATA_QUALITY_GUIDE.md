# Handling Data Quality Issues

## How the System Currently Handles Errors

### ✅ **1. Duplicate Submissions (Same Person, Same Name)**

**Current Behavior:**
- If someone submits the form twice with the **exact same name**, the system automatically:
  - Keeps only ONE staff record (by exact name match)
  - Updates the phone number if a new one is provided
  - **Only the LATEST submission's availability is used** (replaces, not merges)

**Example:**
- Submission 1 (Monday): Name="John", Available: Mon-Tue
- Submission 2 (Tuesday): Name="John", Available: Wed-Thu
- Result: One "John" record, only available Wed-Thu (latest submission replaces old one)

### ⚠️ **2. Wrong Phone Number**

**Current Behavior:**
- If staff submits again with same name but different phone:
  - Phone number is automatically updated
  - Availability is merged with previous submissions

**How to Fix:**
1. Go to Admin Panel → Staff Management
2. Search for the staff member
3. Click "Edit"
4. Fix the phone number
5. Click "Save"

### ⚠️ **3. Wrong Name / Typos**

**Current Behavior:**
- If someone types their name incorrectly (e.g., "Jhon" instead of "John"):
  - System treats them as **different people**
  - Creates separate records: "John" and "Jhon"
  - Both appear in the roster system

**How to Fix:**
1. Go to Admin Panel → Staff Management
2. Search for both versions (e.g., "Jhon" and "John")
3. Edit one to the correct name
4. Delete the duplicate
5. Note: When you edit a name, all their availability and roster assignments are automatically updated

### ⚠️ **4. Name Variations**

**Common Issues:**
- "John" vs "John Smith"
- "Mary" vs "Mary Lee"
- "CYY" vs "CYY Wong"

**Current Behavior:**
- Treated as different people (exact name match only)

**How to Fix:**
1. Go to Admin Panel → Staff Management
2. Decide which name is correct
3. Edit one to match the other
4. Delete the duplicate
5. Future submissions with the correct name will merge automatically

## Manual Staff Management

### **Access:**
Go to: `http://localhost:3000/admin` → Scroll down to "Staff Management"

### **Features:**

1. **Search Staff**
   - Search by name or phone number
   - Real-time filtering

2. **Edit Staff**
   - Click "Edit" button
   - Change name or phone number
   - Click "Save"
   - **Important:** Editing a name updates ALL their availability and roster assignments

3. **Delete Staff**
   - Click "Delete" button
   - Confirmation required
   - **Warning:** This also deletes all their availability and roster assignments

## Best Practices

### **Before Processing Data:**
1. Review your Google Sheet for obvious duplicates/errors
2. You can manually delete duplicate rows in Google Sheets if needed

### **After Processing Data:**
1. Check Admin Panel → Staff Management
2. Look for similar names that might be the same person
3. Use search to find potential duplicates
4. Merge by editing names to match

### **Weekly Workflow:**
1. Process data on Wednesday
2. Check Staff Management for new issues
3. Fix any errors before planning roster
4. Plan roster using Leader's App

## Automatic Deduplication

The system automatically:
- ✅ Removes duplicates by **exact name match** (case-sensitive)
- ✅ Updates phone numbers when name matches
- ✅ Merges availability from multiple submissions with same name

The system does NOT automatically:
- ❌ Fix typos (e.g., "Jhon" → "John")
- ❌ Merge name variations (e.g., "John" + "John Smith")
- ❌ Detect if phone numbers are wrong (only updates if name matches)

## Example Scenarios

### **Scenario 1: Staff Submits Twice**
- Monday: Staff "AJ" submits form
- Tuesday: Staff "AJ" submits again (forgot they already did)
- **Result:** One "AJ" record, latest availability used

### **Scenario 2: Wrong Phone Number**
- Week 1: "John" submits with phone "11111111"
- Week 2: "John" submits with phone "22222222" (corrected)
- **Result:** "John" now has phone "22222222" (updated automatically)

### **Scenario 3: Typo in Name**
- Week 1: Staff types "Jhon" (typo)
- Week 2: Staff types "John" (correct)
- **Result:** Two separate records: "Jhon" and "John"
- **Fix:** Edit "Jhon" to "John" and delete duplicate, OR delete "Jhon" and keep "John"

### **Scenario 4: Name Variations**
- Submission 1: "Mary"
- Submission 2: "Mary Lee"
- **Result:** Two separate records
- **Fix:** Decide correct format, edit one, delete duplicate

## Tips for Minimizing Errors

1. **In Google Form:**
   - Use dropdown lists for names (if possible)
   - Add clear instructions (e.g., "Use your full name as registered")
   - Validate phone number format

2. **After Processing:**
   - Regularly check Staff Management
   - Search for common name variations
   - Fix errors before roster planning

3. **Communicate with Staff:**
   - Tell them to use consistent name format
   - Remind them to double-check before submitting
   - Let them know they can resubmit if they made an error

---

The Staff Management tool makes it easy to fix any data quality issues that slip through!

