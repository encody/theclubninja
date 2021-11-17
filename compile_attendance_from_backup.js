const path = require('path');
const {DateTime} = require('luxon');


(async () => {
  const backupsPath = process.argv[2];
  const termId = process.argv[3];

  if (!backupsPath || !termId) {
    console.log(
      'Usage: node compile_attendance_from_backup.js <backups path> <term>',
    );
    return process.exit(1);
  }

  const membersPath = path.resolve(path.join(backupsPath, 'members.json'));

  const json = require(membersPath);

  const userFields = ['id', 'institutionId', 'email', 'name'];
  const attendanceFields = ['credit', 'event', 'note', 'timestamp', 'type'];

  const csvHeader = userFields.join(',') + ',' + attendanceFields.map(s => 'attendance' + s[0].toUpperCase() + s.slice(1)).join(',');

  console.log(csvHeader);

  json.forEach(o => {
    const userInfo = userFields.map(f => o.Data[f]).join(',');
    // console.log(userInfo);

    const term = o.Data.terms[termId];
    if (term && term.attendance) {
      term.attendance.forEach(a => {
        const attendanceInfo = attendanceFields.map(f => {
          if (f === 'timestamp') {
            return DateTime.fromJSDate(new Date(a[f])).toFormat('yyyy-MM-dd HH:mm:ss');
            // return new Date(a[f]);
          }
          return a[f];
        }).join(',');
        console.log(userInfo + ',' + attendanceInfo);
      });
    }
  });
})();
