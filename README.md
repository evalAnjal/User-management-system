# User Management System (File Based)

Welcome to user management system where one can easily manage users, there are 2 roles currently

1. User
2. Admin

the entire data is stored at `Data` Directory the `accounts.json` you can see inside there contains data

about all the users who MANAGE ie the account that are created for login are stored there, and lets suppose the user gets an id of 1 then the data of that user ie {Users} he will manage will be stored in the file named `users_1.json` so the convension followed is `user_[id].json`


All the backend route is inside the **api** directory wshile all the frontend have their respective routing naming convension eg /login /register /logout etc from the `App Router` feature after next js 12+


to start this application simple go to the given url

`Hosted URL will be here after hosting`

or if you want to clone this repo and run it then you can clone this first

then

`bun install` or `npm install` I used bun

then

`bun run dev` or `npm run dev` depending on your package manager
