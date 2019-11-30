# README

# Docker instructions

We ship as a orchestrated container setup and use docker-compose. Make sure you have docker desktop or CLI installed. 
## Quickstart
```
docker-compose build
docker-compose up
```

On the first run you also need to manually seed the db. 

```
docker-compose run web rake db:create
docker-compose run web rake db:migrate
```

Application requests can now be served at localhost:3000. 
You can change this port in `docker-compose.yml`.  
To stop `docker-compose down`.  

# Rails instructions

If you dont want to use docker compose. 
- Make sure you have ruby and rails installed.   
- You'll need to reset the database config by copying over `config/database_sqlite.yml` to `config/database.yml`. This will change the db from postgres to the default rails sqlite. Followed by `gem install sqlite`. 
- Alternatively you can configure a postgresql cluster locally first and provided it matches the docker compose config it should work. 

```
bundle install
rails db:migrate
rails test
rails s
```


# Supported api end points
There's two routes:  
- `/surveys`  
- `/survey_responses`  
  
They accept POST, GET and GET `url/:id` for debugging.  
Surveys are created by POST to `/surveys`. We require available_places, survey_name and user_id in the query params.  
Survey responses are created by POST to `/survey_responses`.  
Additionally survey_responses linked to a survey or user can be retrieved by passing along the user id or survey id to `/survey_responses` in a GET call.   
The same lookup pattern exists for survey.   

Below are some examples using curl based on the requirements document.  

- List all surveys  
  `curl localhost:3000/surveys`
- Create a new survey  
  `curl -X POST -d="&survey_name=A&user_id=1&available_places=5" /surveys `
- Create a new survey response  
  `curl -X POST -d="&user_id=2&survey_id=1" localhost:3000/survey_responses`
- List all surveys belonging to a user  
  `curl localhost:3000/surveys?user_id=1`
- List all survey responses for a survey  
  `curl localhost:3000/survey_responses?survey_id=1`
- List all survey responses belonging to a user  
  `curl localhost:3000/survey_responses?user_id=2`

Returned results from `/surveys` will have the survey_id marked as id.  
Results from `/survey_responses` have the response id marked by id.  
Both endpoints will return the creation, update times.  

# Arch

This is designed as a minimal backend internal API server. 
Therefore error handling while present is light and merely rescues after the fact and surfaces information that could help diagnose faulty requests to our consumers. 

Unit testing only just tests basic behaviour of controllers. As such e2e/api mock based testing is probably the best bet. 

The data is modelled as a conventional RESTful resource in rails, each with a corresponding route.
Within rails, we set up ActiveRecord relationships between the 3 models, users, surveys and surveyResponses. We create a hierarchy with users having many surveys and survey responses to accomodate user based survey or response lookup.  
This adds custom logic and may not have been the best way to do it vs a users controller. 

Thanks to rails we get unique resource ids and created_at, updated_at timestamps for free. 


# Recreate

These are the steps to generate the boilerplate before the 2nd commit on this folder.   

```
 rails g model User user_id:integer
 rails g scaffold Survey survey_name:string available_places:integer user:references
 rails g scaffold SurveyResponse user:references survey:references
 rails db:migrate
 rails s
```
