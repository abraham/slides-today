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

  Scenario: Clear tag filters
    Given I visit "/"
    When I click on "#firebase"
    And I click on "#actionsongoogle"
    Then I should not see "Welcome to Slides.today"
    And I should not see "PWAs with Angular"
    When I click on "cancel"
    Then I should see "Welcome to Slides.today"
    And I should see "PWAs with Angular" 2 times
    And I should see "Chrome Dev Summit 2019 Extended Madison"
    And I should not see "cancel"

  Scenario: Clear speaker filters
    Given I visit "/"
    When I click on "Pearl Latteier"
    Then I should not see "Welcome to Slides.today"
    When I click on "cancel"
    Then I should see "Welcome to Slides.today"
    And I should not see "cancel"

  Scenario: Filter list of decks by event
    Given I visit "/filters?events=HB6PwwXRjjLhg52ytsMo"
    Then I should not see "Welcome to Slides.today"
    And I should see "Mobile Era"
    And I should see "How Do Service Workers Even?"
    And I should see "Get Talking with Actions on Google"
    And I should not see "Chrome Dev Summit 2019 Extended Madison"

  Scenario: Clear event filters
    Given I visit "/filters?events=HB6PwwXRjjLhg52ytsMo"
    Then I should see "Mobile Era"
    When I click on "cancel"
    Then I should see "Welcome to Slides.today"
    And I should be on "/"
    And I should see "Chrome Dev Summit 2019 Extended Madison"
    And I should not see "cancel"

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
