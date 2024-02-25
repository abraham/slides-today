Feature: Share decks

  Scenario: Share deck
    Given I visit "/decks/-LP90xu1JfaAgTCyhC3D"
    When I click on "Share"
    Then I should see "Tweet"
    And I should see "Post"
    And I should see "Publish"
    And I should see "Copy"

    # TODO: Fix these tests
    # Something about switching Material components to Angular Material broke them
    # When I click on "Share"
    # And I click on "Tweet"
    # Then "https://twitter.com/intent/tweet?text=How%20Do%20Service%20Workers%20Even%3F%20http%3A%2F%2Flocalhost%3A5000%2Fdecks%2F-LP90xu1JfaAgTCyhC3D" should popup
    # When I click on "Share"
    # And I click on "Post"
    # Then "https://www.facebook.com/login.php?skip_api_login=1&api_key=966242223397117&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fsharer%2Fsharer.php%3Fu%3Dhttp%253A%252F%252Flocalhost%253A5000%252Fdecks%252F-LP90xu1JfaAgTCyhC3D&cancel_url=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Fclose_window%2F%3Fapp_id%3D966242223397117%26connect%3D0%23_%3D_&display=popup&locale=en_US" should popup
    # When I click on "Share"
    # And I click on "Publish"
    # Then "https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2FshareArticle%2F%3Furl%3Dhttp%253A%252F%252Flocalhost%253A5000%252Fdecks%252F-LP90xu1JfaAgTCyhC3D&trk=login_reg_redirect" should popup
    # When I click on "Share"
    # And I click on "Copy"
    # Then "http://localhost:5000/decks/-LP90xu1JfaAgTCyhC3D" should be in the clipboard
