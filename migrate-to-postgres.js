"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = __importStar(require("sqlite3"));
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const sqliteDbPath = './yogaDDBB.sqlite';
const pgConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'defaultdb',
    ssl: {
        rejectUnauthorized: false,
    },
};
async function migrateData() {
    const sqliteDb = new sqlite3.Database(sqliteDbPath);
    const pgClient = new pg_1.Client(pgConfig);
    try {
        console.log('�� Starting migration from SQLite to PostgreSQL...');
        await pgClient.connect();
        console.log('LOG: Connected to PostgreSQL');
        console.log('LOG: Migrating poses...');
        const poses = await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM poses', (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        });
        for (const pose of poses) {
            const query = `
        INSERT INTO poses (id, name, description, image) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING
      `;
            await pgClient.query(query, [
                pose.id,
                pose.name,
                pose.description,
                pose.image,
            ]);
        }
        console.log(`LOG: Migrated ${poses.length} poses`);
        console.log('�� Migrating users...');
        const users = await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM users', (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        });
        for (const user of users) {
            const query = `
        INSERT INTO users (id, name, email, "passwordHash", role) 
        VALUES ($1, $2, $3, $4, $5) 
        ON CONFLICT (id) DO NOTHING
      `;
            await pgClient.query(query, [
                user.id,
                user.name,
                user.email,
                user.passwordHash,
                user.role,
            ]);
        }
        console.log(`LOG: Migrated ${users.length} users`);
        console.log('LOG: Migrating sequences...');
        const sequences = await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM sequences', (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        });
        for (const sequence of sequences) {
            const query = `
        INSERT INTO sequences (id, name, description, "isPublic", "userId") 
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING
      `;
            await pgClient.query(query, [
                sequence.id,
                sequence.name,
                sequence.description,
                sequence.isPublic,
                sequence.userId,
            ]);
        }
        console.log(`LOG: Migrated ${sequences.length} sequences`);
        console.log('LOG: Migrating sequence-pose relationships...');
        const sequencePoses = await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM sequence_poses', (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        });
        for (const sp of sequencePoses) {
            try {
                const query = `
      INSERT INTO sequence_poses ("sequencesId", "posesId") 
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;
                await pgClient.query(query, [sp.sequencesId, sp.posesId]);
                console.log(`LOG: Inserted: ${sp.sequencesId} → ${sp.posesId}`);
            }
            catch (err) {
                console.error(`LOG: Failed: ${sp.sequencesId} → ${sp.posesId}`, err.message);
            }
        }
        const relationCount = await pgClient.query('SELECT COUNT(*) FROM sequence_poses');
        const relationCountResult = relationCount.rows[0];
        console.log(`Sequence-Pose relationships in PostgreSQL: ${relationCountResult?.count || 0}`);
        console.log('LOG: Migration completed successfully!');
        console.log('LOG: Verification:');
        const poseCount = await pgClient.query('SELECT COUNT(*) FROM poses');
        const userCount = await pgClient.query('SELECT COUNT(*) FROM users');
        const sequenceCount = await pgClient.query('SELECT COUNT(*) FROM sequences');
        const poseCountResult = poseCount.rows[0];
        const userCountResult = userCount.rows[0];
        const sequenceCountResult = sequenceCount.rows[0];
        console.log(`Poses in PostgreSQL: ${poseCountResult?.count || 0}`);
        console.log(`Users in PostgreSQL: ${userCountResult?.count || 0}`);
        console.log(`Sequences in PostgreSQL: ${sequenceCountResult?.count || 0}`);
    }
    catch (error) {
        console.error('LOG: Migration failed:', error);
    }
    finally {
        sqliteDb.close();
        await pgClient.end();
    }
}
void migrateData();
//# sourceMappingURL=migrate-to-postgres.js.map