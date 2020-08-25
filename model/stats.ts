/*
 Copyright Iskra LLC, Saint-Petersburg, Russia.
 Distribution, reproduction, or derivative works are not permited.
 Contact email: support@iskra-lab.com.
*/

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

export class Stats extends Model {
  public id?: number;
  public counter: number;
  public time: Date;
  public increaseYesterday: number;
  public increaseWeek: number;
}

Stats.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  counter: DataTypes.INTEGER.UNSIGNED,
  time: DataTypes.DATE,
  increaseYesterday: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'increase_yesterday',
  },
  increaseWeek: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'increase_week',
  },
}, {
  tableName: 'stats',
  sequelize,
});
