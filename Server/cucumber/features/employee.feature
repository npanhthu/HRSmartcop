Feature: Administrator can add a new employee into list
	As a administrator
	I want to add an employee to employee list
	so that i can give this employee to a employee of company

	Scenario: Add an employee when employee list is null
		Given I have an empty employee list
		When I add employee with the name "john" and with the last name "terry"
		Then the employee list have exactly 1 item


	Scenario: Add an employee when employee list is not null
		Given I have an employee list have "5" item 
		When I add employee with the employee name "john" and with the last name "terry"
		Then the employee list have exactly "6" item

	Scenario: Add an employee error
		Given I have an employee list and have "2" item 
		When I add employee with the employeename "john"
		Then have exactly "2" item in employee list

	Scenario: Delete an employee
		Given an Administrator and an employee with employeeId 011
		When I delete the employee have employee 011
		Then the employee are not displayed anymore from the list

	Scenario: Delete an employee success
		Given an administrator and have 12 employee in the employee list
		When i delete an employee have employeeId "10"
		Then the employee list have "11" items

	Scenario: Get employee by employeeId
		Given an list employee and 9 employees in the employee list
		When i get employee by employeeId "SMC0002"
		Then return employee object of employee have employeeId "SMC0002"

	Scenario: Get all Employees
		Given an administrator and 12 employees in employee list
		When I get employee list
		Then the employee list have exactly 12 item

	Scenario: Get employee Employees 
		Given an administrator and empty employees in employee list
		When I get all employee from employee list
		Then the employee list exactly 0 item

	Scenario: Create new employeeId
		Given an employee list and have 8 employee
		When I get new EmployeeId to add new employee
		Then return employeeId are "SMC0009"

	Scenario: Edit an employee
		Given I have an employee
		When I edit a employee with employeeId "100" first name "david" and lastname "beckham"
		Then The employee have employeeId 100 has updated

	Scenario: Edit an employee fail
		Given Have an administrator and an employee
		When I edit a employee with id "101" firstName "john" and lastName ""
		Then the employee not updated

	Scenario: Edit fail an employee
		Given an employee and administrator
		When I edit an employee have employeeId "102" firstName "" and lastName "Henry"
		Then The employee update fail


