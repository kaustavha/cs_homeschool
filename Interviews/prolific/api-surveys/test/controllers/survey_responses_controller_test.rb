require "test_helper"

class SurveyResponsesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @survey_response = survey_responses(:one)
  end

  test "should get index" do
    get survey_responses_url, as: :json
    assert_response :success
  end

  test "should create survey_response" do
    assert_difference("SurveyResponse.count") do
      post survey_responses_url, params: { survey_id: @survey_response.survey_id, user_id: @survey_response.user_id }, as: :json
    end

    assert_response 201
  end

  test "should create survey_response till out of space" do
    assert_difference("SurveyResponse.count") do
      post surve
      post survey_responses_url, params: { survey_id: @survey_response.survey_id, user_id: @survey_response.user_id }, as: :json
    end

    assert_response 201
  end

  test "should show survey_response" do
    get survey_response_url(@survey_response), as: :json
    assert_response :success
  end
end
