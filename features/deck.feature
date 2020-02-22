Feature: View deck details

  Scenario: Deck page is accessible from index
    Given I visit "/"
    When I click on "Chrome Dev Summit 2019 Extended Madison"
    Then I should see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "What is CDS?" included
    And I should see "CDS is a two-day summit from the Chrome team to learn about the latest techniques for building for the modern Web, get an early insight into what the team is working on, and to share your thoughts on how they can move the platform forward." included
    And I should be on "/decks/-Ltqo26YtMnty25H6Kn-"
    When I click on "Back"
    Then I should see "Welcome to Slides.today"
    And I should be on "/"

  Scenario: Deck page includes related content
    Given I visit "/decks/-LP90xu1JfaAgTCyhC3D"
    Then I should see "How Do Service Workers Even?"
    And I should see "Mobile Era · Oct 31-Nov 2, 2018"
    And I should see "Event"
    And I should see "Slides"
    And I should see "Video"
    And I should see "Abraham Williams"
    And I should see "Senior Developer at Bendyworks"
    And I should see "Pearl Latteier"
    And I should see "Senior Developer at Propeller Health"
    And I should see "Oslo, Norway"
    And I should see "Sponsors"
    And I should see "Bendyworks"
    And I should see "Share joy and success in our craft"
    And I should see "Resources"
    And I should see "The Service Worker Lifecycle"
    And I should see "A Tale of Four Caches"
