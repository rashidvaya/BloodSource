const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('bloodsource.db');

const code = '000000';
const sql = `UPDATE invitation_codes SET is_active = 1, current_uses = 0, expires_at = NULL WHERE code = ?`;

db.run(sql, [code], function(err) {
  if (err) {
    console.error('Error updating invitation code:', err.message);
    process.exit(1);
  }
  if (this.changes > 0) {
    console.log(`Invitation code '${code}' is now valid.`);
  } else {
    console.log(`Invitation code '${code}' not found or already valid.`);
  }
  db.close();
}); 