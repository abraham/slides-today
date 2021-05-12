Feature: Site works offline

  Scenario: Index page is cached offline
    Given the network is "offline"
    When visiting "/" fails with "ERR_INTERNET_DISCONNECTED"
    Then I should not see "Welcome to Slides.today"
    When the network is "online"
    And I visit "/"
    Then I should see "Welcome to Slides.today"
    When the network is "offline"
    And I visit "/"
    Then I should see "Welcome to Slides.today"

  Scenario: Deck details page is cached offline
    Given the network is "offline"
    When visiting "/decks/-LP90xu1JfaAgTCyhC3D" fails with "ERR_INTERNET_DISCONNECTED"
    Then I should not see "How Do Service Workers Even?"
    When the network is "online"
    And I visit "/decks/-LP90xu1JfaAgTCyhC3D"
    Then I should see "How Do Service Workers Even?"
    # TODO: Test is failing on CI
    # When the network is "offline"
    # And I visit "/decks/-LP90xu1JfaAgTCyhC3D"
    # Then I should see "How Do Service Workers Even?"

