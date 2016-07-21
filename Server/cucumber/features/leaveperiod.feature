Feature: In order to display the leave list and select it when an employee request a leave,
  As an admin,
  I want to configure the period of the leave

  Background: Application is open and administrator has logged-in
	Given I have opened the backend server and logged-in

  Scenario: Create a leaveperiod
    Given I have an empty leaveperiod list
    When I add an leaveperiod to the list
    Then The leaveperiod list contains a single item

