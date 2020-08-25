import * as path from 'path';
import { google } from 'googleapis';
import { Stats } from './model/stats';
import { counter, metric } from './config/ga.json';

const analytics = google.analytics('v3');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, './config/auth.json'),
  scopes: ['https://www.googleapis.com/auth/analytics'],
});

google.options({ auth });

analytics.data.ga.get({
  ids: `ga:${counter}`,
  metrics: metric,
  dimensions: 'ga:date',
  sort: 'ga:date',
  'start-date': '7daysAgo',
  'end-date': 'today',
}).then((response) => {

  const table = response?.data?.rows || [];

  if (table.length !== 8) {
    throw new Error(`Bad response got from GA`);
  }

  const weekMedian = table.slice(0, 7).reduce((acc, cur) => acc += +cur[1], 0) / 7;
  const yesterday = +table[table.length - 2][1];
  const today = +table[table.length - 1][1];
  const increaseYesterday = yesterday > 0 ? Math.round((today / yesterday - 1) * 100) : null;
  const increaseWeek = weekMedian > 0 ? Math.round((today / weekMedian - 1) * 100) : null;

  console.log(`Percentage increase since yesterday: ${increaseYesterday ?? '-'}%`);
  console.log(`Percentage increase relative to the median for past 7 days: ${increaseWeek ?? '-'}%`);

  Stats.findOne({
    where: {
      counter,
    },
  }).then((stats) => {
    if (stats) {
      stats.update({
        time: new Date(),
        increaseYesterday,
        increaseWeek,
      }).catch((error: Error) => console.error(error));
    } else {
      Stats.create({
        counter,
        time: new Date(),
        increaseYesterday,
        increaseWeek,
      }).catch((error: Error) => console.error(error));
    }
  }).catch((error: Error) => {
    console.error(error);
  });

}).catch((error: Error) => {
  console.error(error);
});



