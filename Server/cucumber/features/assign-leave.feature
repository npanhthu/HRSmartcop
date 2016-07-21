Feature: In order to request a leave,
  As a SCP user,
  I want to select a start date and end date using a component calendar view

  Scenario: Add a leave on calendar
    Given a user
    When I want to click on a button "add leave" above the calendar
    Then I fill the information of my leave and display it on the calendar

  Scenario: Supervisor leave calendar view
    Given a supervisor
    When I open the leave calendar
    Then I want to view all the leave from employee

  Scenario: Supervisor leave  calendar edition
    Given a supervisor, user
    When I open the leave calendar
    And I right click on a leave
    Then I have a contextual menu displayed and I can edit my leave
    Then I can delete my leave