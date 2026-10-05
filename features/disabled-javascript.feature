Feature: Site works without JavaScript

  Scenario: Index page shows message
    Given JavaScript is "disabled"
    When I visit "/"
    Then I should not see "Welcome to Slides.today"
    And I should see "JavaScript is required to view Slides.today."
    When JavaScript is "enabled"
    And I visit "/"
    Then I should see "Welcome to Slides.today"
    And I should not see "JavaScript is required to view Slides.today."

  Scenario: Deck details page is rendered without JavaScript
    Given JavaScript is "disabled"
    When I visit "/decks/ORUVX3hKydJ8AjPaaWz2"
    Then I should see "How Do Service Workers Even?"
    And I should see "A Tale of Four Caches"
    And I should see "This year @mobileeraconf has the best #PWA section ever!" included
    And I should not see "JavaScript is required to view Slides.today."
    When JavaScript is "enabled"
    And I visit "/decks/ORUVX3hKydJ8AjPaaWz2"
    Then I should see "How Do Service Workers Even?"
    And I should not see "JavaScript is required to view Slides.today."
