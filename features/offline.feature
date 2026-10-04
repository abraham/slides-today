Feature: Site works offline

  Scenario: Index page is cached offline
    Given the network is "offline"
    When visiting "/" fails with "ERR_INTERNET_DISCONNECTED"
    Then I should not see "Welcome to Slides.today"
    When the network is "online"
    And I visit "/"
    Then I should see "Welcome to Slides.today"
    When the service worker is ready
    And the network is "offline"
    And I visit "/"
    Then I should see "Welcome to Slides.today"

  Scenario: Deck details page is cached offline
    Given the network is "offline"
    When visiting "/decks/ORUVX3hKydJ8AjPaaWz2" fails with "ERR_INTERNET_DISCONNECTED"
    Then I should not see "How Do Service Workers Even?"
    When the network is "online"
    And I visit "/decks/ORUVX3hKydJ8AjPaaWz2"
    Then I should see "How Do Service Workers Even?"
    When the service worker is ready
    And the network is "offline"
    And I visit "/decks/ORUVX3hKydJ8AjPaaWz2"
    Then I should see "How Do Service Workers Even?"

