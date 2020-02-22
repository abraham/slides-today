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

  Scenario: No decks match tag filter
    Given I visit "/"
    When I click on "#firebase"
    And I click on "#actionsongoogle"
    And I click on "#angular"
    Then I should see "Nothing found that includes all the following tags" included
    And I should not see "PWAs with Angular"
    And I should not see "Chrome Dev Summit 2019 Extended Madison"
    And I should not see "See your Action on Google in action"
    When I click on "#firebase"
    And I click on "#actionsongoogle"
    And I click on "#angular"
    Then I should not see "Nothing found that includes all the following tags"
    And I should see "PWAs with Angular" 2 times
    And I should see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "See your Action on Google in action"

  Scenario: Filter decks on a mobile device
    Given I am on a "Pixel 2 XL"
    And I visit "/"
    Then I should not see "Filtered tags"
    When I click on "Tags"
    Then I should see "Filtered tags"
    When I click on "#firebase"
    And I touch the screen
    Then I should not see "Filtered tags"
    And I should not see "Welcome to Slides.today"
    And I should see "PWAs with Angular" 2 times
    And I should not see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "See your Action on Google in action"
    When I click on "Tags"
    Then I should see "Filtered tags"
    When I click on "#firebase"
    And I touch the screen
    Then I should not see "Filtered tags"
    And I should see "Welcome to Slides.today"
    And I should see "PWAs with Angular" 2 times
    And I should see "Chrome Dev Summit 2019 Extended Madison"
    And I should see "See your Action on Google in action"
