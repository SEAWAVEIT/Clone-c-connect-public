import mysql from 'mysql2/promise';

export const connectMySQL = async () => {
    const mysqlConfig = {
       host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: Infinity,
        queueLimit: 0
    };

    try {
        const connection = mysql.createPool(mysqlConfig);
        console.log('Connected to DB');
        return connection;
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
        process.exit(1);
    }
};