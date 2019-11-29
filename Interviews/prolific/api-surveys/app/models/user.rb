class User < ApplicationRecord
  has_many :survey_responses
  has_many :surveys
end
