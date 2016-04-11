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
  addUser(email: "mine@email.com", first_name:"Manuel", last_name:"Tester") {
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
