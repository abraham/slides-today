Feature: Share decks

  Scenario: Share deck
    Given native sharing is unavailable
    And I visit "/decks/-LP90xu1JfaAgTCyhC3D"
    When I click on "Share"
    Then I should see "Tweet"
    And I should see "Post"
    And I should see "Publish"
    And I should see "Copy"

  Scenario: Share links open in a new tab
    Given native sharing is unavailable
    And I visit "/decks/-LP90xu1JfaAgTCyhC3D"
    When I click on "Share"
    Then "Tweet" should open "https://twitter.com/intent/tweet?text=How%20Do%20Service%20Workers%20Even%3F%20http%3A%2F%2Flocalhost%3A5000%2Fdecks%2F-LP90xu1JfaAgTCyhC3D" in a new tab
    And "Post" should open "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Flocalhost%3A5000%2Fdecks%2F-LP90xu1JfaAgTCyhC3D" in a new tab
    And "Publish" should open "https://www.linkedin.com/sharing/share-offsite/?url=http%3A%2F%2Flocalhost%3A5000%2Fdecks%2F-LP90xu1JfaAgTCyhC3D" in a new tab

  Scenario: Copy the deck URL
    Given native sharing is unavailable
    And I have granted permissions
      | clipboard-sanitized-write |
      | clipboard-read            |
    And I visit "/decks/-LP90xu1JfaAgTCyhC3D"
    When I click on "Share"
    And I click on "Copy"
    Then "http://localhost:5000/decks/-LP90xu1JfaAgTCyhC3D" should be in the clipboard
