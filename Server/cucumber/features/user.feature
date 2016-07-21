Feature: Administrator can manage users

  Scenario: Create a user
		Given a Administrator
		When I create a new user 
		Then the user with login "tuan" and with password "123456" is created
  Scenario: Delete user
  		Given an Administrator
		When I select multiple user from a list
		  And I delete the users
		Then the users are not displayed anymore from the list  
  Scenario: User has been disabled	
		Given an employee
		And my account is not enabled
		When I log into the application with my credentials
		Then the system  throws and exception od type DisabledUserException
