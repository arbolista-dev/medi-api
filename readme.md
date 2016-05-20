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

## DB: Development / test environment
```
// Test
source .env.test

// Development
source .env
```

## API Documentation

### Add user

mutation {
  addUser(email: "abc@example.com", first_name:"Manuel", last_name:"Tester", password: "test2016") {
    id,
    token
  }
}


### Update user

mutation{
  updateUser(id: 12, email: "new@test.com", first_name:"Thomas", password: "new_password") {
    id,
    email,
    first_name,
    last_name
  }
}


### Delete user

mutation {
  deleteUser(id: 3) {
    id
  }
}

### Authenticate user

mutation {
  authenticateUser(email: "abc@example.com", password: "test2016") {
    token
  }
}


### List all users with their sessions

{
  user {
    id
    email,
    first_name,
    last_name,
    sessions {
      id,
      status,
      date,
      duration_planned,
      duration_success,
      location,
      note
    }
  }
}

### Add session

mutation {
  addSession(user_id: 1, status: true, location: "In the forest", note: "Feeling good", date:"2016-04-27 04:05:06", duration_planned:600, duration_success: 600) {
    id
  }
}



### Update session

mutation{
  updateUser(id: 12, email: "new@test.com", first_name:"Thomas", password: "new_password") {
    id,
    email,
    first_name,
    last_name
  }
}


### Delete session

mutation {
  deleteUser(id: 3) {
    id
  }
}

### List all sessions

{
  session {
    id
    date
    duration_planned
    duration_success
    user_id
    status
    note
  }
}
