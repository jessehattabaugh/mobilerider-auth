# Auth API

this project creates two POST endpoints

`/signin` - accepts json in the form of `{username: String, password: String}` and returns `{token}` where token is a UUID

`/signout` - accepts an `"Authorization"` header in the form of `"Bearer UUID"` where UUID is the `{token}` returned from `/signin`

## to test

1. `$ npm install`
2. `$ npm start`
3. `curl --location --request POST 'http://localhost:8080/signin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "user1",
    "password": "123"
}'`
4. assert return value is in the form `{token: UUID}`
5. assert the file `/db/sessions.json` should contain the UUID
6. `curl --location --request POST 'http://localhost:8080/signout' \
--header 'Authorization: Bearer UUID'` where UUID is the UUID asserted above
7. assert that the file `/db/sessions.json` now has a record with the UUID and a field `signed_out_at`

### Note, only one session can be created at a time

If a second call to /signin with the same username/password is made, a second session will not be created and a token will not be returned, until the first session is signed out by calling `/signout` with the previous session's token.

## Implementation

I've used the `express` package to handle the HTTP requests, the `uuid` package to generate random session tokens not tied to the user's data, and the `diskdb` package as a database. `diskdb` has an API that's analagous to `mongodb` so replacing it with an external MongoDB server should be trivial.

## Concerns

- The sessions collection will grow indefinitely. I'd reccommend deleting old sessions if feasible.
- The current number of allowed sessions is only one, but that could be increased.
- I am currently returning the same HTTP status code for a mismatched password, and too manay sessions. The client will likely want to distinguish between these to provide better messaging. 
