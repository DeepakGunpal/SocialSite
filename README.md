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
POST /register and aws => deepak //plz add location, interests, recommendedcount, school, college, workplace, status
  auto suggest available username
  follower request - accept request
  get follower request api
POST /login and auth => sunandini soni
validation => ankit
post/follow => rubi

GET /user/:userId/profile (Authentication required) => swati
  filterQuery - name(substring), username
  isDeleted false
PUT /user/:userId/profile (Authentication and Authorization required) => sweta di
Put /user
delete/user/:userId/profile (Authentication and Authorization required) => Ankit
```

update

<!-- hit=following count++,follower count++ -->

user--

follow api
accept/reject api

Post Schema--rubi

caption
photo--url
video--url
enum--post type---public/private
location
like--default 0
commentCount-
comment-[]

api---
createPost---rubi
get post---sunandini
update post-- Deepak
delete post--Swati
like Api


comment schema
ref: post, user
schema: body, image/gif, date , deletedAt,isdeleted
createComment (path contain userId,postId) : Ankit
getComment  (path param contail postId ,commentId(query))  : Sweta Di
updateComment  (patch)path param contail userId,commentId) : Mitesh
deleteComment path param contail userId,commentId) : Mitesh