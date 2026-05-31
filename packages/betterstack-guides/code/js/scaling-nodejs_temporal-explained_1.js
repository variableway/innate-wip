# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 1

const meetingStart = new Date(2025, 1, 6);
scheduleNotifications(meetingStart);    // This might modify our date
displayMeetingTime(meetingStart);       // Now showing wrong time!