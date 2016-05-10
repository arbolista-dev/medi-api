begin;

create schema medi_app_test;
set search_path = medi_app_test;


/** Create tables **/

create table users(
  id          serial not null primary key,
  email       varchar(50) not null unique,
  first_name  varchar(50),
  last_name   varchar(50),
  hash        varchar(60)
);

create table sessions(
  id serial primary key,
  user_id integer REFERENCES users ON DELETE CASCADE,
  status boolean,
  date timestamp,
  duration_planned interval,
  duration_success interval,
  location varchar(50),
  note varchar(255)
);


/** Permissions **/

grant select on users, sessions to public;


/** Test data **/
/** Password: first_name+id */

insert into users (id, email, first_name, last_name, hash) values
  (1, 'test1@example.com', 'Thomas', 'Cook', '$2a$10$3WeqXz8CeEgS22DwTattAe8q25s3cc/NONrcF9FV8ih9rOV.lk6lm'),
  (2, 'test2@example.com', 'Jamie', 'Thomas', '$2a$10$khZGWCAoBLbY/B4jkEnBGeKHqv69H1eFJkxzlenQlbVB83GUrzJ5G'),
  (3, 'test3@example.com', 'Jimmy', 'Hendrix', '$2a$10$lyjtsTZD3KzQoOInr.MLM.m5tOoIK41KwlfmwSSOXIModNBPTZ9Py');

alter sequence users_id_seq restart with 4;

insert into sessions (id, user_id, status, date, duration_planned, duration_success, location, note) values
  (1, 1, true, '2016-04-27 04:05:06', '0 0:10:00', '0 0:10:00', 'At home', 'Good day'),
  (2, 1, false, '2016-03-27 08:05:06', '0 0:20:00', '0 0:15:00', 'In the park', 'Bad day'),
  (3, 2, true, '2016-04-24 04:05:06', '0 0:10:00', '0 0:10:00', 'In bed', 'Rainy day'),
  (4, 3, true, '2016-04-22 04:05:06', '0 0:10:00', '0 0:10:00', 'In the metro', 'Busy day');

alter sequence sessions_id_seq restart with 5;


commit;
