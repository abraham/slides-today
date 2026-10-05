Feature: View deck details

  Scenario: Deck page is accessible from index
    Given I visit "/"
    When I click on "Chrome Dev Summit 2019 Extended Madison"
    Then I should see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "What is CDS?" included
    And I should see "CDS is a two-day summit from the Chrome team to learn about the latest techniques for building for the modern Web, get an early insight into what the team is working on, and to share your thoughts on how they can move the platform forward." included
    And I should be on "/decks/jlJ2346Me0OHb7tI9UxU"
    When I click on "Back"
    Then I should see "Welcome to Slides.today"
    And I should be on "/"

  Scenario: Deck page includes related content
    Given I visit "/decks/ORUVX3hKydJ8AjPaaWz2"
    Then I should see "How Do Service Workers Even?"
    And I should see "Mobile Era"
    And I should see "Oct 31-Nov 2, 2018 · Oslo, Norway"
    And I should see "Homepage" 3 times
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

  Scenario: Event card links to the presentations of the event
    Given I visit "/decks/ORUVX3hKydJ8AjPaaWz2"
    When I click on "Presentations"
    Then I should not see "Welcome to Slides.today"
    And I should see "How Do Service Workers Even?"
    And I should see "Get Talking with Actions on Google"
    And I should not see "Chrome Dev Summit 2019 Extended Madison"
    And I should be on "/filters?events=HB6PwwXRjjLhg52ytsMo"

  Scenario: Deck given at multiple events has an event card for each
    Given I visit "/decks/p8pLdyuXzSjgwqSBrbwg"
    Then I should see "IWD Global Diversity CFP Day Workshop"
    And I should see "GDG Madison"
    And I should see "Madison Women in Tech"
    And I should see "Mar 2, 2019 · Madison, WI" 2 times
    And I should see "Presentations" 2 times

  Scenario: Legacy deck id redirects to the new deck id
    Given I visit "/decks/-LP90xu1JfaAgTCyhC3D"
    Then I should see "How Do Service Workers Even?"
    And I should be on "/decks/ORUVX3hKydJ8AjPaaWz2"

  Scenario: Unknown deck id is a 404
    Given I visit "/decks/zzzzzzzzzzzzzzzzzzzz"
    Then the response status should be 404
    And I should see "Page Not Found"

  Scenario: Deck page is served without a trailing slash
    Given I visit "/decks/ORUVX3hKydJ8AjPaaWz2/"
    Then I should be on "/decks/ORUVX3hKydJ8AjPaaWz2"
    And the response status should be 200
