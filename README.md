# About

GA Stats reads historical data from Google Analytics, displays it on the screen and writes it into database table.

How to start:
```
npm install
npm start
```

# Configuration

1. Create GA configuration file `config/ga.json`
```json
{
  "counter": 123456,
  "metric": "ga:users"
}
```
Place GA counter ID instead of 123456.

2. Run MySQL instance and create a new table
```sql
CREATE TABLE stats (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  counter INT UNSIGNED NOT NULL COMMENT 'Google Analytics counter ID',
  time DATETIME NOT NULL COMMENT 'Last update time',
  increase_yesterday INT NULL,
  increase_week INT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (counter)
);
```

3. Create database configuration file `config/database.json`
```json
{ 
  "database": "database name",
  "host": "host name",
  "port": 3306,
  "username": "user",
  "password": "password",
  "dialect": "mysql",
  "timezone": "+03:00",
  "pool": {
    "max": 5,
    "min": 0,
    "acquire": 30000,
    "idle": 10000
  }
}
```

4. Obtain Google Analytics OAuth key (see below) and put in into file `config/auth.json`


# How to obtain Google Analytics OAuth key

1. Access [Google APIs Console](https://console.developers.google.com/)
1. Create a new project
1. Click button Enable APIs and services and choose Google Analytics API
1. Create a new Service Account and get JSON auth file
1. Put it into ./config/auth.json file
1. Add access for the key email in Google Analytics Admin panel


# Result

Example data
```
2020-08-18: 5
2020-08-19: 8
2020-08-20: 15
2020-08-21: 36
2020-08-22: 92
2020-08-23: 258
2020-08-24: 433
2020-08-25: 722
```

Output in console
```
$ npm --silent start
Percentage increase since yesterday: 67%
Percentage increase relative to the median for past 7 days: 497%
```

Output in database
```text
mysql> select * from stats;
+----+-----------+---------------------+--------------------+---------------+
| id | counter   | time                | increase_yesterday | increase_week |
+----+-----------+---------------------+--------------------+---------------+
|  1 | 227293214 | 2020-08-25 17:51:16 |                 67 |           497 |
+----+-----------+---------------------+--------------------+---------------+
1 row in set (0.00 sec)
```
