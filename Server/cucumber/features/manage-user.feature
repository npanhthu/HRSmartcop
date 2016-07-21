Feature: Adminstrator follow create user and list all users

	Scenario: Users listing
		Given a Administrator
     		And these following users are created by Administrator
     	 | Login			 | Password			    	|
		 | employee1		 | MyPassord2015			|
         | employee2		 | MyPassord2015			|
		When I list all users 
		Then the following users are listed
     	 | Login			 | Password				    |
		 | employee1		 | MyPassord2015			|
   	  	 | employee2		 | MyPassord2015			|

  