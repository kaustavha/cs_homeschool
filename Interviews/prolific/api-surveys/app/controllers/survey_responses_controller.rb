class SurveyResponsesController < ApplicationController
  before_action :set_survey_response, only: [:show, :update, :destroy]

  # GET /survey_responses
  def index
    @survey_responses = SurveyResponse.all

    render json: @survey_responses
  end

  # GET /survey_responses/1
  def show
    render json: @survey_response
  end

  # POST /survey_responses
  def create
    @survey_response = SurveyResponse.new(survey_response_params)

    if @survey_response.save
      render json: @survey_response, status: :created, location: @survey_response
    else
      render json: @survey_response.errors, status: :unprocessable_entity
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
      @survey_response = SurveyResponse.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def survey_response_params
      params.require(:survey_response).permit(:user_id, :survey_id)
    end
end
