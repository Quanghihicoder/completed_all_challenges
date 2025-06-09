# Salary Calculator

A Node.js app that reads a list of bookings from input.json, calculates each booking's cost based on time-of-day and weekend rates, and writes the results to output.json. The app enforces business rules like minimum duration, valid time ranges, and applies full-night or weekend rates where applicable.

## Assumptions

### Timezone Consistency

* Inputs must have matching timezones between the `from` and `to` fields.
  ❌ Example (rejected):

  ```json
  {
    "from": "2017-10-18T18:00:00+11:00",
    "to": "2017-10-18T19:00:00-11:00"
  }
  ```

* Inputs with the same timezone (even if not `+11:00`) are allowed.
  ✅ Example (accepted):

  ```json
  {
    "from": "2017-10-18T18:00:00-11:00",
    "to": "2017-10-18T20:00:00-11:00"
  }
  ```

### Time Interpretation

* Day (`Mon` to `Sun`), hour (0–23), and minute values are calculated based on the **timezone in the input string**, not the system's local timezone.
* This ensures correctness when converting dates across timezones.
  Example:

  ```
  Input: 2025-06-08T06:00:00-11:00  
  Correct interpretation: Sunday in UTC-11  
  Native JS Date methods (e.g., `getDay`) would incorrectly interpret this as Monday in local time (e.g., Sydney +10)
  ```

### Rounding

* Decimal values are rounded **down** to two decimal places.
  Example:

  ```
  155.255 → 155.25 (not 155.26)
  ```

### Weekend and Night Rates

* Weekend and night hours are split based on the actual hour ranges:

  ```
  22:00 Fri – 05:00 Sat   → 2h night rate (Friday) + 5h Saturday rate  
  22:00 Sat – 05:00 Sun   → 2h Saturday rate + 5h Sunday rate  
  22:00 Sun – 10:00 Mon   → 2h Sunday rate + 10h night rate
  ```

---

## Run Book

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start the application
npm start
```

---

