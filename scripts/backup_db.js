const fs = require('fs');
const path = require('path');

function backupDatabase() {
  const dataDir = path.join(process.cwd(), 'data');
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'yove_academy.db');
  if (!fs.existsSync(dbPath)) {
    console.error('Error: Database file ./data/yove_academy.db does not exist.');
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `yove_academy_${timestamp}.db`);

  try {
    fs.copyFileSync(dbPath, backupPath);
    console.log(`[CRON / SCRIPT] Database backup successful: ${backupPath}`);

    // Keep up to 30 recent backups
    const backupFiles = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('yove_academy_') && f.endsWith('.db'))
      .sort()
      .reverse();

    if (backupFiles.length > 30) {
      for (let i = 30; i < backupFiles.length; i++) {
        fs.unlinkSync(path.join(backupDir, backupFiles[i]));
        console.log(`[CRON / SCRIPT] Removed old backup: ${backupFiles[i]}`);
      }
    }
  } catch (err) {
    console.error('[CRON / SCRIPT] Database backup failed:', err);
    process.exit(1);
  }
}

backupDatabase();
