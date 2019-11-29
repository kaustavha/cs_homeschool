class SurveyResponsesController < ApplicationController
  before_action only: [:index, :create, :show]

  # GET /survey_responses
  def index
    # given user id and survey id - we get all reponses to that survey the user authored
    if (params.has_key?(:user_id) && params.has_key?(:survey_id))
      set_user
      @survey = @user.surveys.where(id: params[:survey_id]).first
      @survey_responses = @survey.survey_responses
      # Given a user id we return all responses tied to that user
    elsif (params.has_key?(:user_id))
      set_user
      @survey_responses = @user.survey_responses
      # Given a survey id we return all responses to that survey
    elsif (params.has_key?(:survey_id))
      get_survey
      @survey_responses = @survey.survey_responses
    else
      @survey_responses = SurveyResponse.all
    end

    render json: @survey_responses
  end

  # GET /survey_responses/1
  def show
    set_survey_response
    render json: @survey_response
  end

  # POST /survey_responses
  def create
    set_user
    get_survey
    if (@survey.available_places > 0)
      @survey.available_places -= 1
      @survey_response = @survey.survey_responses.create!(survey_response_params)
      if @survey.save
        render json: @survey_response, status: :created, location: @survey_response
      else
        render json: @survey.errors, status: :unprocessable_entity
      end
    else
      render json: @survey, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /survey_responses/1
  def update
    if @survey_response.update(survey_response_params)
      render json: @survey_response
    else
      render json: @survey_response.errors, status: :unprocessable_entity
    end
  end

  # DELETE /survey_responses/1
  def destroy
    @survey_response.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_survey_response
    @survey_response = SurveyResponse.find!(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def survey_response_params
    params.permit(:user_id, :survey_id)
  end

  def get_survey
    @survey = Survey.where(id: params[:survey_id]).first!
  end

  def set_user
    @user = User.where(id: params[:user_id]).first_or_create(id: params[:user_id])
  end
end
