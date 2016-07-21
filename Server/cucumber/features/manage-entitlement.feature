Feature: In order to display the list of entitlements linked to an employee,
  As a SCP admin,
  I want to list the entitlements assigned to an employee and be able to delete them

  Scenario: Create an entitlement
    Given a SCP Administrator
    When I create a new entitlement
    Then the entitlement is created

  Scenario: Edit an entitlement
    Given a SCP Administrator
    When I edit a entitlement
    Then the entitlement is changed

  Scenario: List entitle
    Given a SCP Administrator
    When I search an entitlement
    Then the following entitlement are listed
      | LeaveTypes		 | Valid From	| Valid To	|
      | Winter holidays	 | 2014-5-6		| 2014-7-6  |
      | Tet 	         | 2014-1-1		| 2014-2-3  |

  Scenario: Entitlement deletion
    Given a SCP Administrator
    When I select multiple entitlements from a list
    And I delete the entitlements
    Then the entitlements are not displayed anymore from the list

