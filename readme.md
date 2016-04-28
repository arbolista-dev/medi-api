# Medi App - API

This repository contains a Express-based GraphQL API for the Medi App.

## Scripts

Install dependencies
```
npm install
```

Build server
```
gulp build
```

## API Documentation

### Add user

mutation {
  addUser(email: "mine@email.com", first_name:"Manuel", last_name:"Tester", password: "testtesttest") {
    id
  }
}

### Update user

mutation{
  updateUser(id: "12", email: "new@test.com", first_name:"Thomas") {
    id,
    email,
    first_name,
    last_name
  }
}


### Delete user

mutation {
  deleteUser(id: "3") {
    id
  }
}

### List all users

{
  user {
    id
    email,
    first_name,
    last_name
  }
}

### List all sessions

{
  session {
    id
    duration_planned
    duration_success
    user {
      email,
      id,
      first_name,
      last_name
    }
    user_id
    status
    note
  }
}
