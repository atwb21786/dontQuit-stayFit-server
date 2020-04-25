## THE DONT QUIT STAY FIT APP

[DONT QUIT STAY FIT APP](http://dontquit-stayfit-client.now.sh)

<img src="/src/Image/capstonepage.png" alt="Landing Page">

Welcome to the "Don't Quit, Stay Fit!" fitness application!  

This application allows you to combine many of the functions that you would normally have to use in multiple fitness apps into just one!  This app provides you also with an
opporunity to set goals and give yourself feedback with regards to how you are achieving those goals relative to your progress.  Whenever you enter a Goal, Weight, Exercise (Fitness) or Feedback (Accountability), you can chart your progress through the log that outputs beneath the input field, giving you the ability to see how you are doing and what you need to improve upon.  A great way to set goals and analyze your progress!

## In this app, you are able to:
- Register an account.
- Sign in with either the demo account or your own account
- Access one of four links that allow you to enter data for Goals, Weight, Fitness and Feedback (Accountability)
- You are about to enter data, delete data and update data.
- You are able to cancel out of updating or entering data.
- You are able to navigate back to the homepage from any of the four links.
- You are able to logout and return to the Landing Page from any of the four webpages AND the homepage.

## API Documentation: 
- POST /users
- https://whipsering-peak-20829.herokuapp.com/users
- allows you to create a username and password for registration

- POST /auth/login
- https://whispering-peak-20829.herokuapp.com/auth/login
- allows you to login once you enter the correct username, password combination

- POST /goals; POST /weigh_in; POST /fitness; POST /feedback
- https://whispering-peak-20829.herokuapp.com/goals; https://whispering-peak-20829.herokuapp.com/weigh_in; https://whispering-peak-20829.herokuapp.com/fitness; https://whispering-peak-20829.herokuapp.com/feedback
- allows you to post data to any of the four databases

- GET /goals; GET /weigh_in; GET /fitness; GET /feedback
- https://whispering-peak-20829.herokuapp.com/goals/; https://whispering-peak-20829.herokuapp.com/weigh_in/; https://whispering-peak-20829.herokuapp.com/fitness/; https://whispering-peak-20829.herokuapp.com/feedback/
- allows you to get data to the four databases for only the POST requests you have made

- PATCH /goals; PATCH /weigh_in; PATCH /fitness; PATCH /feedback
- https://whispering-peak-20829.herokuapp.com/goals/:goals_id; https://whispering-peak-20829.herokuapp.com/weigh_in/:weigh_in_id; https://whispering-peak-20829.herokuapp.com/fitness/fitness_id; https://whispering-peak-20829.herokuapp.com/feedback/feedback_id
- allows you to update data 

- DELETE /goals; DELETE /weigh_in; DELETE /fitness; DELETE /feedback
- https://whispering-peak-20829.herokuapp.com/goals/:goals_id; https://whispering-peak-20829.herokuapp.com/weigh_in/:weigh_in_id; https://whispering-peak-20829.herokuapp.com/fitness/fitness_id; https://whispering-peak-20829.herokuapp.com/feedback/feedback_id
- allows you to delete data



## Technologies Used
- ReactJS
- Express 
- NodeJS
- Postgres
- SQL
- HTML
- CSS

