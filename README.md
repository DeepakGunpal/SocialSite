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
POST /register and aws => deepak //plz add location, interests, recommendedcount, school, college, workplace, status
  auto suggest available username
POST /login and auth => sunandini soni
validation => ankit
post/follow => rubi
GET /user/:userId/profile (Authentication required) => swati
  filterQuery - name(substring), username
  isDeleted false
PUT /user/:userId/profile (Authentication and Authorization required) => sweta di

delete/user/:userId/profile (Authentication and Authorization required) => 
```
