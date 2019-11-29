require 'test_helper'

class SurveysControllerTest < ActionDispatch::IntegrationTest
  setup do
    @survey = surveys(:one)
  end

  test "should get index" do
    get surveys_url, as: :json
    assert_response :success
  end

  test "should create survey" do
    assert_difference('Survey.count') do
      post surveys_url, params: { survey: { available_places: @survey.available_places, survey_name: @survey.survey_name, user_id: @survey.user_id } }, as: :json
    end

    assert_response 201
  end

  test "should show survey" do
    get survey_url(@survey), as: :json
    assert_response :success
  end

  test "should update survey" do
    patch survey_url(@survey), params: { survey: { available_places: @survey.available_places, survey_name: @survey.survey_name, user_id: @survey.user_id } }, as: :json
    assert_response 200
  end

  test "should destroy survey" do
    assert_difference('Survey.count', -1) do
      delete survey_url(@survey), as: :json
    end

    assert_response 204
  end
end
