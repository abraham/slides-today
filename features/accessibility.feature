Feature: Accessibility

  Scenario: Index has no accessibility violations
    Given I visit "/"
    Then the page should have no accessibility violations

  Scenario: Filtered index has no accessibility violations
    Given I visit "/filters?tags=firebase"
    Then the page should have no accessibility violations

  Scenario: Deck page has no accessibility violations
    Given I visit "/decks/ORUVX3hKydJ8AjPaaWz2"
    Then the page should have no accessibility violations

  Scenario: Not found page has no accessibility violations
    Given I visit "/decks/zzzzzzzzzzzzzzzzzzzz"
    Then the page should have no accessibility violations
