class Survey < ApplicationRecord
  belongs_to :user
  has_many :survey_responses
end
