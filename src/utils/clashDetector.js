export const detectClash = (allTimetables, currentDay, currentTime, currentTeacher, currentRoom, ignoreId = null) => {
  const clashes = [];
  
  if (!currentTime) return clashes;
  const normTime1 = currentTime.replace(/\s/g, '').toLowerCase();

  allTimetables.forEach(tt => {
    if (ignoreId && tt.id === ignoreId) return;

    const daySchedule = tt.days[currentDay] || [];
    daySchedule.forEach(c => {
      if (!c.time) return;
      const normTime2 = c.time.replace(/\s/g, '').toLowerCase();
      
      if (normTime1 === normTime2) {
         if (currentTeacher && c.teacher && currentTeacher.trim().toLowerCase() === c.teacher.trim().toLowerCase()) {
            clashes.push(`Teacher Clash: ${c.teacher} is busy in ${tt.program} ${tt.semester} Section ${tt.section}`);
         }
         if (currentRoom && c.room && currentRoom.trim().toLowerCase() === c.room.trim().toLowerCase()) {
            clashes.push(`Room Clash: ${c.room} is already booked for ${tt.program} ${tt.semester} Section ${tt.section}`);
         }
      }
    });
  });

  return clashes;
};
