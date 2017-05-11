This is an attempt to integrate our product, Bubble Uno, with Alexa.

Expected Goal - Handsfree TV viewing.

For example:

User:  'Alexa, ask Bubble what is playing right now on Comedy Central'
Alexa: 'Comedy Central is playing The Daily Show with Trevor Noah right now'
User: 'What is the genre of this show'
Alexa: 'Genre of this show is Political Comedy'


Steps:

1) Create an AWS account. Open the console and go to Lambda functions.
2) Create a new Lambda function. Zip the files (except the folder 'Bubble') and upload the zip folder. AWS automatically unzips your code and creates a lambda function that can be invoked by Alexa. This is where you write your intents, the expected responses and handle all your logic
3) Go to Amazon Developer Portal and create a new Alexa skill. Give it a name and while configuring it, select your lambda function you created in Step 2. 
4) You are ready to test your skill. 

Please note the folder 'Bubble' has nothing to do with Alexa integration. That is a backend service created (can be hosted anywhere) which talks to a database and retrieves information. An obvious improvement would be to directly invoke the database from our lambda function but since this was our production database, I decided to just expose our db through webservices. The lambda function calls this webservice which returns information like 'Which movie is playing on Star Movies right now' and 'What is it's rating'

Next Steps:
1) Making queries more efficient.
2) On a trigger 'Alexa, change channel to HBO', the trigger would invoke our service which in turn would send a signal to our IoT device that will change channel on a user's TV. That's completely hands free TV viewing

