Feature: Site shows JavaScript required message

  Scenario: Index page shows message
    Given JavaScript is "disabled"
    When I visit "/"
    Then I should not see "Welcome to Slides.today"
    And I should see "JavaScript is required to view Slides.today."
    When JavaScript is "enabled"
    And I visit "/"
    Then I should see "Welcome to Slides.today"
    And I should not see "JavaScript is required to view Slides.today."

  Scenario: Deck details page shows message
    Given JavaScript is "disabled"
    When I visit "/decks/-LP90xu1JfaAgTCyhC3D"
    Then I should not see "How Do Service Workers Even?"
    And I should see "JavaScript is required to view Slides.today."
    When JavaScript is "enabled"
    And I visit "/decks/-LP90xu1JfaAgTCyhC3D"
    Then I should see "How Do Service Workers Even?"
    And I should not see "JavaScript is required to view Slides.today."

