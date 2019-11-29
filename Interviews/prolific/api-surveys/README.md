# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...


# Recreate

```
 rails g model User user_id:integer
 rails g scaffold Survey survey_name:string available_places:integer user:references
 rails g scaffold SurveyResponse user:references survey:references
 rails db:migrate
 rails s
```

# Supported api end points
```
// create surveys
 curl -X POST -d="&survey_name=a&user_id=1&available_places=5" localhost:3000/surveys

// get all surveys
curl localhost:3000/surveys

// return user created surveys
curl localhost:3000/surveys?user_id=420

// return survey responses
curl localhost:3000/survey_responses?survey_id=58

// create a survey resp
 curl -X POST -d="&survey_id=1&user_id=5" localhost:3000/survey_responses
```
