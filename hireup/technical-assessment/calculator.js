const fs = require('fs');

const MIN_BOOKING_TIME = 60
const MAX_BOOKING_TIME = 24 * 60
const BOOKING_TIME_INCREMENT = 15

const DAY_RATE = 38
const NIGHT_RATE = 42.93
const SAT_RATE = 45.91
const SUN_RATE = 60.85

// Day_time start from 6, end at 20  
const START_DAY_TIME = 6 * 60
const END_DAY_TIME = 20 * 60
const MAX_DAY_TIME = 24 * 60

const SAME_TIMEZONE_ONLY = true

const minutesDifference = (dateStr1, dateStr2) => {
  const timezoneRegex = /([+-]\d{2}:\d{2})$/

  const tz1 = dateStr1.match(timezoneRegex);
  const tz2 = dateStr2.match(timezoneRegex);

  if ((!tz1 || !tz2 || tz1[1] !== tz2[1]) && SAME_TIMEZONE_ONLY) {
    return -1;
  }

  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);

  const diffMilliseconds = date2 - date1;
  const diffMinutes = diffMilliseconds / (1000 * 60);

  return diffMinutes;
}
// The standard functions getDay, getHours, and getMinutes calculate values based on the local timezone (e.g., Sydney).
// This causes issues when the input date is in a different timezone.
// For example, it might be Sunday in timezone -11, but when converted to Sydney time (UTC+10), it becomes Monday — which is incorrect for the original context.
const parseDateWithTimezone = (dateStr) => {
  // Parse the ISO string with timezone
  const date = new Date(dateStr);
  
  // Extract timezone offset from the string (in minutes)
  const tzMatch = dateStr.match(/([+-])(\d{2}):(\d{2})$/);
  const tzSign = tzMatch[1] === '+' ? 1 : -1;
  const tzHours = parseInt(tzMatch[2], 10);
  const tzMinutes = parseInt(tzMatch[3], 10);
  const totalTzOffsetMinutes = tzSign * (tzHours * 60 + tzMinutes);
  
  // Get the UTC time components
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  const utcDay = date.getUTCDay();
  
  // Calculate local time components (according to the string's timezone)
  let localHours = utcHours + (totalTzOffsetMinutes / 60);
  let localDay = utcDay;
  
  // Adjust for day overflow/underflow
  if (localHours >= 24) {
    localHours -= 24;
    localDay = (utcDay + 1) % 7;
  } else if (localHours < 0) {
    localHours += 24;
    localDay = (utcDay - 1 + 7) % 7;
  }
  
  return {
    day: localDay,   
    hour: Math.floor(localHours),  
    minute: utcMinutes + (totalTzOffsetMinutes % 60) 
  };
}

const calculateSalary = (dateStr1, dateStr2) => {
  let total = 0

  // ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const date1 = parseDateWithTimezone(dateStr1)
  const date2 = parseDateWithTimezone(dateStr2) 

  const day1 = date1.day

  const hours1 = date1.hour
  const hours2 = date2.hour


  const minutes1 = date1.minute
  const minutes2 = date2.minute


  // **th minutes of the day
  const startTime = hours1 * 60 + minutes1
  const endTime = hours2 * 60 + minutes2

  // Time diff 
  const timeDiff = minutesDifference(dateStr1, dateStr2)

  if (MAX_DAY_TIME - startTime > timeDiff) {
    // Same day
    if (day1 == 6) {
      // Sat
      total = timeDiff * SAT_RATE / 60
    } else if (day1 == 0) {
      // Sun
      total = timeDiff * SUN_RATE / 60 
    } else {
      if (startTime < START_DAY_TIME || endTime > END_DAY_TIME) {
        // Night rate
        total = timeDiff * NIGHT_RATE / 60
      } else {
        // Day rate
        total = timeDiff * DAY_RATE / 60
      }
    }
  } else {
    // Diff day
    if (day1 == 6) {
      // Start on Sat, next is Sun
      total = (MAX_DAY_TIME - startTime) / 60 * SAT_RATE + endTime / 60 * SUN_RATE
    }
    else if (day1 == 0) {
      // Start on Sun, next is Mon (plus night rate)
      total = (MAX_DAY_TIME - startTime) / 60 * SUN_RATE + endTime / 60 * NIGHT_RATE
    } else if (day1 == 5) {
      // Start on Fri (plus night rate), next is Sat 
      total = (MAX_DAY_TIME - startTime) / 60 * NIGHT_RATE + endTime / 60 * SAT_RATE
    }
    else {
      // Because it is a different day so it has to be night rate 
      total = timeDiff / 60 * NIGHT_RATE
    }
  }

  // Two decimal
  return parseFloat(total.toFixed(2))
}


const calculator = (input) => {
  let result = []

  input.forEach(item => {
    const timeDiff = minutesDifference(item.from, item.to) 

    if (timeDiff > MIN_BOOKING_TIME && timeDiff < MAX_BOOKING_TIME && timeDiff % BOOKING_TIME_INCREMENT == 0) {
      //true 
      result.push({
        "id": item.id,
        "from": item.from,
        "to": item.to,
        "isValid": true,
        "total": calculateSalary(item.from, item.to)
      })
    } else {
      result.push({
        "id": item.id,
        "from": item.from,
        "to": item.to,
        "isValid": false,
        "total": 0
      })
    }
  });

  // Convert to JSON string with indentation
  const json = JSON.stringify(result, null, 2);

  // Save to file
  fs.writeFileSync('output.json', json, 'utf8');

  return result;
}

export default calculator;
