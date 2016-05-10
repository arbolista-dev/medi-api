begin;

create schema medi_app_dev;
set search_path = medi_app_dev;


/** Create tables **/

create table users(
  id          serial not null PRIMARY KEY,
  email       varchar(50) not null unique,
  first_name  varchar(50),
  last_name   varchar(50),
  hash        varchar(60)
);

create table sessions(
  id serial PRIMARY KEY,
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

commit;
