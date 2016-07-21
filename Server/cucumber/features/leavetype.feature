Feature: Administrator can add a new LeaveType into list
  As a administrator
  I want to add an LeaveType to user list
  So that I can give this leave type

  Background: Application is open and administrator has logged-in
	Given I have opened the backend server and logged-in

  Scenario: Create a leavetype
    Given I have an empty leavetype list
    When I add an leavetype to the list
    Then The leavetype list contains a single item

  Scenario: List leavetypes
    Given an Administrator
    And these following leavetype are created by Administrator
      | LeaveType			 | Country			|
      | Winter Holiday		 | American			|
      | Tet Vn		 | Vietnamese			|
    When I list all leavetypes
    Then the following leavetype are listed
      | LeaveType			 | Country			|
      | Winter Holiday		 | American			|
      | Tet Vn		 | Vietnamese			|

  Scenario: Leavetype deletion
    Given an Administrator
    When I select multiple leavetype from a list
    And I delete the leavetypes
    Then the leavetypes are not displayed anymore from the list