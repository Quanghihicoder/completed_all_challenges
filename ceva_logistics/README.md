# Solutions for CEVA Logistics Tech Assessment

[Company's website](https://www.cevalogistics.com/en/careers)

# 📌 Question 1: .NET Core Web API

**Directory**: `UserActivityApi/UserActivityApi`  
**Main File**: `Controllers/UserActivityController.cs`

## 🔧 How to Run

1. Navigate to the `UserActivityApi/UserActivityApi` directory:
   ```bash
   cd UserActivityApi/UserActivityApi
   ```

2. Run the Web API (make sure you have the .NET SDK installed):
   ```bash
   dotnet run
   ```

3. The API should be available at `http://localhost:5216/swagger/index.html`.

---

# 📌 Question 2: Node.js Script

**File**: `groupActivitiesByEmployee.js`  
**Location**: Root directory

## 🔧 How to Run

1. Make sure you have Node.js installed.

2. From the root of the repository, run:
   ```bash
   node groupActivitiesByEmployee.js
   ```

3. The output will be printed to the console, showing grouped activity data by employee.

---

# 📌 Question 3: SQL - Remove Duplicate Records

**Files**:
- `create.sql`: Script to create and populate the `model` table.
- `delete.sql`: Script to remove duplicate `make` and `model` combinations, keeping the record with the highest ID.
- `create.png`: Screenshot showing the data before deletion.
- `delete.png`: Screenshot showing the result after removing duplicates.
