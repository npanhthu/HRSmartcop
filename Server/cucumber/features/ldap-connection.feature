Feature: In order to to connect SmartCorp application
  As a smartdev employee
  I want to use my LDAP credentials

  Scenario: Ldap Connection
    Given I have an LDAP credentials 
    When I connect to ldap
    Then The employee will implement to an employee system