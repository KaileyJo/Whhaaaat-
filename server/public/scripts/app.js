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
		$('#container').append('<div class="employeeInformations"></div>');
		var $el = $('#container').children().last();
		$el.append('<p>Employee: ' + info[i].first_name + ' ' + info[i].last_name + '</p>');
		$el.append('<p>ID: ' + info[i].emp_id + '</p>');
		$el.append('<p>Title: ' + info[i].job_title + '</p>');
		$el.append('<p> Salary: $<span class="salary">' + info[i].emp_salary + '</span></p>');
		$el.append('<button class="deactivate">Deactivate Employee</button>');
		combinedSalary += Number(info[i].emp_salary);
		totalToMonthly();
	}
}

function deactivate() {
	var $div = $(this).parent();
	var $salary = $div.find('.salary').text();
	$div.toggleClass('inactive');
	$div.append('<button class="activate">Activate Employee</button>');
	combinedSalary -= Number($salary);
	totalToMonthly();
	$(this).remove();
}

function activate() {
	var $div = $(this).parent();
	var $salary = $div.find('.salary').text();
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