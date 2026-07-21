import { connectMySQL } from "../config/sqlconfig.js";

const connection = await connectMySQL();

export const cleanupExpiredLogins = async () => {
  const [userKYCs] = await connection.execute(
    `SELECT username, orgcode, tokenIssuedAt, 'userkyctable' AS tablename
     FROM userkyctable
     WHERE loggedin = 1`
  );

  const [users] = await connection.execute(
    `SELECT username, orgcode, tokenIssuedAt, 'users' AS tablename
     FROM users
     WHERE loggedin = 1`
  );

  const userLogins = [...userKYCs, ...users];

  console.log("Logged in users found:", userLogins.length);

  const now = new Date();

  for (const user of userLogins) {
    // Skip invalid login timestamps
    if (!user.tokenIssuedAt) {
      console.log(
        `Skipping ${user.username} (${user.tablename}) - tokenIssuedAt is NULL`
      );
      continue;
    }

    const issuedAt = new Date(user.tokenIssuedAt);

    const tenHoursLater = new Date(
      issuedAt.getTime() + 10 * 60 * 60 * 1000
    );

    const midnight = new Date(issuedAt);
    midnight.setHours(24, 0, 0, 0);

    const expiresAt = new Date(
      Math.min(tenHoursLater.getTime(), midnight.getTime())
    );

    console.log({
      username: user.username,
      table: user.tablename,
      issuedAt,
      expiresAt,
      now,
      expired: now > expiresAt,
    });

    if (now > expiresAt) {
      const table = user.tablename;

      const [result] = await connection.execute(
        `UPDATE ${table}
         SET loggedin = 0
         WHERE username = ? AND orgcode = ?`,
        [user.username, user.orgcode]
      );

      console.log(
        `Logged out ${user.username} from ${table}. Rows updated: ${result.affectedRows}`
      );
    }
  }
};
