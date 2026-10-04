const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');
const { sqlitePool, initializeSqliteDatabase, all: sqliteAll, run: sqliteRun, db: sqliteDb } = require('./localDatabase');

let activePool = sqlitePool;
let isUsingSqlite = true;
let lastBackupTime = null;
let lastBackupFile = null;

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '4000'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'visai2027',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
};

if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = { minVersion: 'TLSv1.2', rejectUnauthorized: true };
}

let initPromise = null;

// Proxy pool that delegates to MySQL/TiDB when connected, or SQLite local DB
const poolProxy = {
  async query(sql, params) {
    if (initPromise) await initPromise;
    return activePool.query(sql, params);
  },
  async getConnection() {
    if (initPromise) await initPromise;
    return activePool.getConnection();
  },
  isSqlite() {
    return isUsingSqlite;
  },
  async getDbStatus() {
    let tidbConnected = !isUsingSqlite;
    let tablesSummary = {};
    const tableNames = [
      'users', 'user_profiles', 'events', 'rounds', 'teams',
      'team_leader_details', 'team_members', 'college_details',
      'problem_statements', 'team_problem_selections', 'submissions',
      'jury_members', 'jury_assignments', 'evaluations', 'payments', 'audit_logs'
    ];

    for (const tbl of tableNames) {
      try {
        const [rows] = await activePool.query(`SELECT COUNT(*) as count FROM ${tbl}`);
        tablesSummary[tbl] = rows[0]?.count || 0;
      } catch (e) {
        tablesSummary[tbl] = 0;
      }
    }

    return {
      engine: isUsingSqlite ? 'SQLite (Local Safety Mirror & Storage)' : 'TiDB Cloud (Distributed SQL)',
      isTiDbConnected: tidbConnected,
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      ssl: process.env.DB_SSL === 'true',
      lastBackupTime,
      lastBackupFile,
      tables: tablesSummary,
      safetyStorageActive: true,
      timestamp: new Date().toISOString()
    };
  },

  async syncAndBackupDatabase() {
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const tableNames = [
      'users', 'user_profiles', 'events', 'rounds', 'teams',
      'team_leader_details', 'team_members', 'college_details',
      'problem_statements', 'team_problem_selections', 'submissions',
      'jury_members', 'jury_assignments', 'evaluations', 'payments', 'audit_logs'
    ];

    const snapshot = {
      timestamp: new Date().toISOString(),
      source_engine: isUsingSqlite ? 'SQLite' : 'TiDB',
      data: {}
    };

    let totalRecords = 0;
    for (const tbl of tableNames) {
      try {
        const [rows] = await activePool.query(`SELECT * FROM ${tbl}`);
        snapshot.data[tbl] = rows;
        totalRecords += rows.length;
      } catch (e) {
        snapshot.data[tbl] = [];
      }
    }

    const filename = `snapshot-${Date.now()}.json`;
    const filePath = path.join(backupDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');

    // Also write a latest snapshot
    fs.writeFileSync(path.join(backupDir, 'latest-snapshot.json'), JSON.stringify(snapshot, null, 2), 'utf-8');

    lastBackupTime = new Date().toISOString();
    lastBackupFile = filename;

    return {
      success: true,
      backupFile: filename,
      totalRecords,
      timestamp: lastBackupTime,
      tablesBackedUp: Object.keys(snapshot.data).length
    };
  },

  async testTiDbConnection(customConfig = null) {
    const cfg = customConfig ? { ...dbConfig, ...customConfig } : dbConfig;
    try {
      const testPool = mysql.createPool(cfg);
      const conn = await testPool.getConnection();
      const [result] = await conn.query('SELECT VERSION() as version');
      conn.release();
      await testPool.end();
      return {
        success: true,
        message: 'TiDB connection successful!',
        version: result[0]?.version || 'TiDB / MySQL compatible'
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
        code: err.code
      };
    }
  }
};

async function initDatabaseEngine() {
  try {
    const mysqlPool = mysql.createPool(dbConfig);
    const conn = await mysqlPool.getConnection();
    console.log('[DB] Connected to TiDB/MySQL database successfully');
    conn.release();
    activePool = mysqlPool;
    isUsingSqlite = false;
  } catch (err) {
    console.log('[DB] TiDB/MySQL server not detected on host:', dbConfig.host);
    console.log('[DB] Initializing and connecting to Local SQLite safety database: server/visai.db ...');
    await initializeSqliteDatabase();
    activePool = sqlitePool;
    isUsingSqlite = true;
    console.log('[DB] Local SQLite safety database connected and fully operational!');
  }

  // Initial safety backup snapshot
  try {
    await poolProxy.syncAndBackupDatabase();
  } catch(e) {}
}

initPromise = initDatabaseEngine();

module.exports = poolProxy;

