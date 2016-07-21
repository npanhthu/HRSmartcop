Feature: In order to manage the Roles in the system,
  The system will display to a SCP supervisor or administrator,
  a form which will be in charge of add \ save a Role, set the permissions on it, load and delete

  Scenario: Create a role
    Given an Administrator
    When I create a new role
    Then the role is created

  Scenario: List roles
    Given an Administrator
    And these following roles are created by Administrator
      | User Role				 | User Role Type			|
      | Employee		 | ESS			|
      | HR Manager		 | Admin			|
    When I list all roles
    Then the following users are listed
      | User Role				 | User Role Type			|
      | Employee		 | ESS			|
      | HR Manager		 | Admin			|

  Scenario: Role deletion
    Given an Administrator
    When I select multiple role from a list
    And I delete the roles
    Then the roles are not displayed anymore from the list