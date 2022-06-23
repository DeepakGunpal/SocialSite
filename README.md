# Social Networking Site

Tried to create a clone of Facebook

## Feature-1 => User

It contains 5 APIs

### User Model

```bash
{ 
  fname: {string, mandatory},
  lname: {string, mandatory},
  email: {string, mandatory, valid email, unique},
  profileImage: {string, mandatory}, // s3 link
  phone: {string, mandatory, unique, valid Indian mobile number}, 
  password: {string, mandatory, minLen 8, maxLen 15}, // encrypted password
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```

### User APIs

```bash
POST /register
POST /login
GET /user/:userId/profile (Authentication required)
PUT /user/:userId/profile (Authentication and Authorization required)
```