Feature:Log-in application

  Scenario: User Login
    Given a user
	When I log into the application with my credential
	Then my user account is correctly authenticated 

	

