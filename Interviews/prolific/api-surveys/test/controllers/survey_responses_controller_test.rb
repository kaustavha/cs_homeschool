require 'test_helper'

class SurveyResponsesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @survey_response = survey_responses(:one)
  end

  test "should get index" do
    get survey_responses_url, as: :json
    assert_response :success
  end

  test "should create survey_response" do
    assert_difference('SurveyResponse.count') do
      post survey_responses_url, params: { survey_response: { survey_id: @survey_response.survey_id, user_id: @survey_response.user_id } }, as: :json
    end

    assert_response 201
  end

  test "should show survey_response" do
    get survey_response_url(@survey_response), as: :json
    assert_response :success
  end

  test "should update survey_response" do
    patch survey_response_url(@survey_response), params: { survey_response: { survey_id: @survey_response.survey_id, user_id: @survey_response.user_id } }, as: :json
    assert_response 200
  end

  test "should destroy survey_response" do
    assert_difference('SurveyResponse.count', -1) do
      delete survey_response_url(@survey_response), as: :json
    end

    assert_response 204
  end
end
