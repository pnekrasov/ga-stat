import { Sequelize, Dialect } from 'sequelize';
import { format } from 'date-fns';
import { database, username, password, port, dialect, pool, host } from './config/database.json';

const timezone = format(new Date(), 'xxx');
const dialectOptions = {
  timezone,
};

export const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: dialect as Dialect,
  dialectOptions,
  timezone,
  logging: false,
  pool,
  define: { timestamps: false, freezeTableName: true },
});
