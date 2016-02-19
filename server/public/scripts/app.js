var combinedSalary = 0;
var monthlyExpenses = 0;
var money = 0;

$(document).ready(function () {
	getData();
	$('#submit').on('click', postEmployee);
	$('#container').on('click', '.deactivate', deactivate);
	$('#container').on('click', '.activate', activate);
});

function getData() {
	$.ajax({
		type: 'GET',
		url: 'employee_records',
		success: function(data) {
			appendEmployee(data);
		}
	});
}

function postEmployee() {
	event.preventDefault();
	var values = {};

	$.each($('#employeeForm').serializeArray(), function(i, field) {
		values[field.name] = field.value;
	});

	console.log(values);

	$.ajax({
		type: 'POST',
		url: 'employee_records',
		data: values,
		success: function(data) {
			if(data) {
				console.log('from server: ', data);
				getData();
			} else {
				console.log('error');
			}
		}
	});
}

function appendEmployee(info) {
	$('#container').empty();
	for (var i = 0; i < info.length; i++) {
		$('#container').append('<div></div>');
		var $el = $('#container').children().last();
		$el.append('<p>' + info[i].first_name + '</p>');
		$el.append('<p>' + info[i].last_name + '</p>');
		$el.append('<p>' + info[i].emp_id + '</p>');
		$el.append('<p>' + info[i].job_title + '</p>');
		$el.append('<p class="salary">' + info[i].emp_salary + '</p>');
		$el.append('<button class="deactivate">Deactivate Employee</button>');
		combinedSalary += Number(info[i].emp_salary);
		totalToMonthly();
	}
}

function deactivate() {
	var $div = $(this).parent();
	var $salary = $div.children('.salary').text();
	$div.toggleClass('inactive');
	$div.append('<button class="activate">Activate Employee</button>');
	combinedSalary -= Number($salary);
	totalToMonthly();
	$(this).remove();
}

function activate() {
	var $div = $(this).parent();
	var $salary = $div.children('.salary').text();
	$div.toggleClass('inactive');
	$div.append('<button class="deactivate">Deactivate Employee</button>');
	$(this).remove();
	combinedSalary += Number($salary);
	totalToMonthly();
}

function totalToMonthly() {
	monthlyExpenses = combinedSalary/12;
	money = (Math.round(monthlyExpenses * 100) / 100).toFixed(2);
	$('#expenses').text(money);
}
//$(document).ready(function() {
//	var empArray = [];
//	var combinedSalary = 0;
//	var monthlyExpenses = 0;
//	$('#employeeForm').on('submit', function(event) {
//		event.preventDefault();
//
//		var values = {};
//
//		$.each($('#employeeForm').serializeArray(), function(i, field) {
//			values[field.name] = field.value;
//		});
//
//		$('#employeeForm').find('input[type=text]').val('');
//		appendDom(values);
//
//		combinedSalary += Number(values.empSalary);
//		monthlyExpenses = combinedSalary/12;
//
//		allSalaries(values);
//
//		$('button').on('click', function () {
//			$(this).parentsUntil('#container').remove('div');
//		});
//
//	});
//
//	function appendDom(empInfo) {
//		$('#container').append('<div></div>');
//		var $el = $('#container').children().last();
//
//		$el.append('<p class= "inline">' + empInfo.empFirstName + '     ' + '</p>');
//		$el.append('<p class= "inline">' + empInfo.empLastName + '     ' + '</p>');
//		$el.append('<p class= "inline">' + empInfo.empID + '     ' + '</p>');
//		$el.append('<p class= "inline">' + empInfo.jobTitle + '     ' + '</p>');
//		$el.append('<p class= "inline">' + empInfo.empSalary + '     ' + '</p>');
//		$('div p').last().addClass('salary');
//		$('salary').data('mySalary', empInfo.empSalary);
//	}
//
//	function allSalaries(empInfo) {
//		var $el = $('#container div').children().last();
//		$el.append('<p>' + '</p>');
//		$el.append('<p class= "inline">' + 'Monthly Salary Expenses: ' + monthlyExpenses + '     ' + '</p>');
//		$el.append('<button class= "inline">' + 'Delete Employee' + '</button>');
//		$el.append('<p>' + '</p>');
//		$('button').last().parentsUntil('#container').addClass(empInfo.empFirstName);
//		$('button').last().data('mySalary', empInfo.empSalary);
//	}
//});