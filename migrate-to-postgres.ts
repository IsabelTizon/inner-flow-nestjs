import * as sqlite3 from 'sqlite3';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// SQLite database path
const sqliteDbPath = './yogaDDBB.sqlite';

// PostgreSQL connection config
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

// Type definitions
interface Pose {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

interface Sequence {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  userId: string;
}

interface SequencePose {
  sequencesId: string;
  posesId: string;
}

async function migrateData() {
  const sqliteDb = new sqlite3.Database(sqliteDbPath);
  const pgClient = new Client(pgConfig);

  try {
    console.log('�� Starting migration from SQLite to PostgreSQL...');

    // Connect to PostgreSQL
    await pgClient.connect();
    console.log('LOG: Connected to PostgreSQL');

    // Migrate poses
    console.log('LOG: Migrating poses...');
    const poses = await new Promise<Pose[]>((resolve, reject) => {
      sqliteDb.all('SELECT * FROM poses', (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Pose[]);
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

    // Migrate users
    console.log('�� Migrating users...');
    const users = await new Promise<User[]>((resolve, reject) => {
      sqliteDb.all('SELECT * FROM users', (err, rows) => {
        if (err) reject(err);
        else resolve(rows as User[]);
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

    // Migrate sequences
    console.log('LOG: Migrating sequences...');
    const sequences = await new Promise<Sequence[]>((resolve, reject) => {
      sqliteDb.all('SELECT * FROM sequences', (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Sequence[]);
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

    // Migrate sequence_poses relationships
    console.log('LOG: Migrating sequence-pose relationships...');
    const sequencePoses = await new Promise<SequencePose[]>(
      (resolve, reject) => {
        sqliteDb.all('SELECT * FROM sequence_poses', (err, rows) => {
          if (err) reject(err);
          else resolve(rows as SequencePose[]);
        });
      },
    );

    for (const sp of sequencePoses) {
      try {
        const query = `
      INSERT INTO sequence_poses ("sequencesId", "posesId") 
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;
        await pgClient.query(query, [sp.sequencesId, sp.posesId]);
        console.log(`LOG: Inserted: ${sp.sequencesId} → ${sp.posesId}`);
      } catch (err) {
        console.error(
          `LOG: Failed: ${sp.sequencesId} → ${sp.posesId}`,
          (err as Error).message,
        );
      }
    }

    const relationCount = await pgClient.query(
      'SELECT COUNT(*) FROM sequence_poses',
    );
    const relationCountResult = relationCount.rows[0] as
      | { count: string }
      | undefined;
    console.log(
      `Sequence-Pose relationships in PostgreSQL: ${relationCountResult?.count || 0}`,
    );

    console.log('LOG: Migration completed successfully!');

    // Verify the data
    console.log('LOG: Verification:');
    const poseCount = await pgClient.query('SELECT COUNT(*) FROM poses');
    const userCount = await pgClient.query('SELECT COUNT(*) FROM users');
    const sequenceCount = await pgClient.query(
      'SELECT COUNT(*) FROM sequences',
    );

    const poseCountResult = poseCount.rows[0] as { count: string } | undefined;
    const userCountResult = userCount.rows[0] as { count: string } | undefined;
    const sequenceCountResult = sequenceCount.rows[0] as
      | { count: string }
      | undefined;

    console.log(`Poses in PostgreSQL: ${poseCountResult?.count || 0}`);
    console.log(`Users in PostgreSQL: ${userCountResult?.count || 0}`);
    console.log(`Sequences in PostgreSQL: ${sequenceCountResult?.count || 0}`);
  } catch (error) {
    console.error('LOG: Migration failed:', error);
  } finally {
    sqliteDb.close();
    await pgClient.end();
  }
}

void migrateData();
