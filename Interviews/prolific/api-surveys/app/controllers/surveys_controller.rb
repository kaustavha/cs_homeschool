class SurveysController < ApplicationController
  before_action only: [:show, :index, :create]

  # GET /surveys
  def index
    if (params.has_key?(:user_id))
      set_user
      @surveys = @user.surveys
    else
      @surveys = Survey.all
    end

    json_response @surveys, :ok
  end

  # GET /surveys/1
  def show
    set_survey
    render json: @survey
  end

  # POST /surveys
  def create
    set_user

    if survey_params[:user_id].nil? || survey_params[:available_places].nil? || survey_params[:survey_name].nil?
      json_response nil, :unprocessable_entity
      return
    end

    @survey = @user.surveys.create!(survey_params)
    json_response @survey, :created
  end

  # PATCH/PUT /surveys/1
  def update
    if @survey.update(survey_params)
      render json: @survey
    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  # DELETE /surveys/1
  def destroy
    @survey.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_survey
    @survey = Survey.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def survey_params
    params.permit(:survey_name, :available_places, :user_id)
  end

  def set_user
    @user = User.where(id: params[:user_id]).first_or_create!(id: params[:user_id])
  end
end
