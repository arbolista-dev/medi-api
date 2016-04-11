create table users(
  id serial primary key,
  email varchar(255) not null unique,
  first_name varchar(50),
  last_name varchar(50)
);

create table sessions(
  id serial primary key,
  user_id integer references users,
  status boolean,
  date timestamp,
  duration_planned interval,
  duration_success interval,
  location varchar(50),
  note varchar(255)
);
