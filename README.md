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
  location:{},
  interest:{},//filtered post
  dob:{},
  status:{},
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```

### User APIs

```bash
POST /register and aws => deepak
  auto suggest available username
POST /login and auth => sunandini soni
validation => ankit
post/follow => rubi
GET /user/:userId/profile (Authentication required) => swati
  filterQuery - name(substring), username
  isDeleted false
PUT /user/:userId/profile (Authentication and Authorization required) => sweta di

delete/user/:userId/profile (Authentication and Authorization required) => Ankit
```
update
<!-- hit=following count++,follower count++ -->