# 📊 AKE Tracking Feature

## What is AKE?

AKE appears to be work units or requirements that need to be tracked per day for your warehouse operations.

**3 Types of AKE:**
1. **MS 馬莎 AKE** - MS (Marks & Spencer related)
2. **ET 肯亞菜 AKE** - ET (Kenya vegetables related)
3. **PER 鮮活 AKE** - PER (Fresh/live products related)

---

## How It Works

### For Leaders (Input):

**Location:** Leader App → Plan Roster tab → Each day card

**Steps:**
1. **See AKE button** on each date:
   - Yellow button: "➕ Set AKE" (if not set)
   - Yellow button: "✏️ Edit AKE" (if already set)

2. **Click the button** → Modal opens

3. **Input numbers:**
   - MS 馬莎 AKE: [type number or leave empty for 0]
   - ET 肯亞菜 AKE: [type number or leave empty for 0]
   - PER 鮮活 AKE: [type number or leave empty for 0]
   - **Total AKE:** Shows automatically (sum of all)

4. **Click Save** → Modal closes

5. **See requirements** displayed on the day card:
   ```
   AKE Required:
   MS: 5  ET: 3  PER: 2  Total: 10
   ```

---

### For Admins (View):

**Location:** Admin Panel → Scroll to "AKE Requirements Report"

**What you see:**

| Date | MS 馬莎 | ET 肯亞菜 | PER 鮮活 | Total AKE |
|------|---------|-----------|----------|-----------|
| Mon, Nov 4, 2025 | 5 | 3 | 2 | **10** |
| Tue, Nov 5, 2025 | 3 | 5 | 1 | **9** |
| Wed, Nov 6, 2025 | 4 | 4 | 3 | **11** |

**Features:**
- ✅ Sorted by date (newest first)
- ✅ Shows all 3 AKE types
- ✅ Total calculated automatically
- ✅ Easy to review at a glance
- ✅ Mobile-friendly table (scrollable)

---

## Use Cases

### Daily Planning:
1. **Leader sets AKE requirements** for the week
2. **Leader assigns staff** based on AKE needs
3. **Admin reviews** the AKE requirements report

### Weekly Review:
- Admin Panel shows historical AKE requirements
- Compare week-to-week workload
- Plan staffing accordingly

---

## Data Storage

**Database Table:** `ake_requirements`

**Columns:**
- `date` - The date (unique)
- `ms_ake` - MS AKE count
- `et_ake` - ET AKE count  
- `per_ake` - PER AKE count
- `total_ake` - Sum (calculated automatically)
- `created_at` - When first set
- `updated_at` - When last modified

**Rules:**
- Empty input = 0
- Negative numbers not allowed
- Total calculated automatically (MS + ET + PER)
- One record per date (updates on re-save)

---

## UI/UX Details

### Leader Input Modal:
- **Large number inputs** (easy to tap on mobile)
- **Clear labels** with Chinese/English names
- **Real-time total** calculation
- **Yellow theme** (distinct from staff assignment purple)
- **Empty = 0** (no need to type 0)

### Day Card Display:
- **Yellow box** shows current AKE requirements
- **Compact format:** "MS: 5  ET: 3  PER: 2  Total: 10"
- **Only shown if total > 0** (doesn't clutter empty days)
- **Edit button** always available

### Admin Report Table:
- **Clean table** with color-coded headers
- **Total column highlighted** (most important)
- **Sorted by date** (newest first)
- **Responsive** (works on mobile/tablet/desktop)

---

## Workflow Example

**Monday Morning:**
Leader knows this week's workload:
- Monday needs 5 MS, 3 ET, 2 PER
- Tuesday needs 3 MS, 5 ET, 1 PER
- etc.

**Leader inputs AKE requirements:**
1. Click "➕ Set AKE" on Monday
2. Type: MS=5, ET=3, PER=2
3. Save → Total shows 10
4. Repeat for other days

**Then assigns staff:**
- Assigns 10 staff for Monday (matching 10 AKE total)
- Assigns 9 staff for Tuesday (matching 9 AKE total)
- etc.

**You (Admin) review:**
- Admin Panel → AKE Report
- See all requirements in one table
- Verify staffing matches AKE needs

---

## Benefits

**For Leader:**
- ✅ Track daily workload requirements
- ✅ Quick input on mobile
- ✅ See requirements while assigning staff
- ✅ Ensure correct staffing levels

**For You:**
- ✅ Overview of all AKE requirements
- ✅ Historical tracking
- ✅ Verify adequate staffing
- ✅ Plan future weeks

---

## After Deployment

**Test it:**

1. **Leader App** → Plan Roster
2. **Click "➕ Set AKE"** on any date
3. **Enter numbers** (e.g., MS=5, ET=3, PER=2)
4. **Click Save**
5. **See display** on day card
6. **Admin Panel** → Check AKE Requirements Report table

**Everything should work seamlessly!** ✨

