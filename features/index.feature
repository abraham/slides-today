Feature: View and filter list of decks

  Scenario: View list of decks
    Given I visit "/"
    Then I should see "Welcome to Slides.today"
    And I should see "PWAs with Angular" 2 times
    And I should see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "See your Action on Google in action"

  Scenario: Filter list of decks by one tag
    Given I visit "/"
    When I click on "#firebase"
    Then I should not see "Welcome to Slides.today"
    And I should see "PWAs with Angular" 2 times
    And I should not see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "See your Action on Google in action"
    When I click on "#firebase"
    Then I should see "Welcome to Slides.today"
    And I should see "PWAs with Angular" 2 times
    And I should see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "See your Action on Google in action"

  Scenario: Filter list of decks by multiple tags
    Given I visit "/"
    When I click on "#firebase"
    And I click on "#actionsongoogle"
    Then I should not see "PWAs with Angular"
    And I should not see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "See your Action on Google in action"
    When I click on "#firebase"
    And I click on "#actionsongoogle"
    And I should see "PWAs with Angular" 2 times
    And I should see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "See your Action on Google in action"

  Scenario: No decks match filters
    Given I visit "/"
    When I click on "#firebase"
    And I click on "#actionsongoogle"
    And I click on "#angular"
    Then I should see "Nothing found that includes all the following filters" included
    And I should not see "PWAs with Angular"
    And I should not see "Chrome Dev Summit 2019 Extended Madison"
    And I should not see "See your Action on Google in action"
    When I click on "#firebase"
    And I click on "#actionsongoogle"
    And I click on "#angular"
    Then I should not see "Nothing found that includes all the following filters"
    And I should see "PWAs with Angular" 2 times
    And I should see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "See your Action on Google in action"

  Scenario: Filter decks on a mobile device
    Given I am on a "Pixel 2 XL"
    And I visit "/"
    Then I should not see "Filter decks"
    When I click on "Filters"
    Then I should see "Filter decks"
    When I click on "#firebase"
    And I touch the screen
    Then I should not see "Filter decks"
    And I should not see "Welcome to Slides.today"
    And I should see "PWAs with Angular" 2 times
    And I should not see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "See your Action on Google in action"
    When I click on "Filters"
    Then I should see "Filter decks"
    When I click on "#firebase"
    And I touch the screen
    Then I should not see "Filter decks"
    And I should see "Welcome to Slides.today"
    And I should see "PWAs with Angular" 2 times
    And I should see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "See your Action on Google in action"
