export const columns = {
    informationDetails: {
        personalInfo: {
            employeeId: {
                id: "employeeId",
                label: "Employee ID",
                category: "Personal Info",
            },
            firstName: {
                id: "firstName",
                label: "First Name",
                category: "Personal Info",
            },
            lastName: {
                id: "lastName",
                label: "Last Name",
                category: "Personal Info",
            },
            middleName: {
                id: "middleName",
                label: "Middle Name",
                category: "Personal Info",
            },
            fullName: {
                id: "fullName",
                label: "Full Name",
                category: "Personal Info",
            },
            gender: {
                id: "gender",
                label: "Gender",
                category: "Personal Info",
            },
            dateOfBirth: {
                id: "dateOfBirth",
                label: "Date of Birth",
                category: "Personal Info",
                isParent: true,
            },
            age: {
                id: "age",
                label: "Age",
                category: "Personal Info",
            },
            civilStatus: {
                id: "civilStatus",
                label: "Civil Status",
                category: "Personal Info",
            },
        },
        contactInfo: {
            contactNumber: {
                id: "contactNumber",
                label: "Contact Number",
                category: "Contact Details",
            },
            email: {
                id: "email",
                label: "Email Address",
                category: "Contact Details",
            },
            currentAddress: {
                id: "currentAddress",
                label: "Current Address",
                category: "Contact Details",
            },
            permanentAddress: {
                id: "permanentAddress",
                label: "Permanent Address",
                category: "Contact Details",
            },
            nationality: {
                id: "nationality",
                label: "Nationality",
                category: "Contact Details",
            },
        },
        emergencyContact: {
            emergencyName: {
                id: "emergencyName",
                label: "Emergency Contact Name",
                category: "Emergency Contact",
            },
            emergencyNumber: {
                id: "emergencyNumber",
                label: "Emergency Contact Number",
                category: "Emergency Contact",
            },
            emergencyRelation: {
                id: "emergencyRelation",
                label: "Relationship to Contact",
                category: "Emergency Contact",
            },
        },
        employmentDetails: {
            position: {
                id: "position",
                label: "Position Title",
                category: "Employment Info",
            },
            department: {
                id: "department",
                label: "Department",
                category: "Employment Info",
            },
            businessUnit: {
                id: "businessUnit",
                label: "Business Unit",
                category: "Employment Info",
            },
            reportingManager: {
                id: "reportingManager",
                label: "Reporting Manager",
                category: "Employment Info",
            },
            dateHired: {
                id: "dateHired",
                label: "Date Hired",
                category: "Employment Info",
            },
            dateRegularized: {
                id: "dateRegularized",
                label: "Date Regularized",
                category: "Employment Info",
            },
            employmentStatus: {
                id: "employmentStatus",
                label: "Employment Status",
                category: "Employment Info",
            },
            lengthOfService: {
                id: "lengthOfService",
                label: "Length of Service",
                category: "Employment Info",
            },
            workArrangement: {
                id: "workArrangement",
                label: "Work Arrangement",
                category: "Employment Info",
            },
            companyName: {
                id: "companyName",
                label: "Company Name",
                category: "Employment Info",
            },
            employeeType: {
                id: "employeeType",
                label: "Employee Type",
                category: "Employment Info",
            },
        },
        terminationInfo: {
            endDate: {
                id: "endDate",
                label: "Employment End Date",
                category: "Termination Details",
            },
            terminationReason: {
                id: "terminationReason",
                label: "Reason for Termination",
                category: "Termination Details",
            },
            lengthOfService: {
                id: "lengthOfService",
                label: "Length of Service",
                category: "Termination Details",
            },
        },
    },
    compensationPayroll: {
        basicCompensation: {
            basicSalary: {
                id: "basicSalary",
                label: "Basic Salary",
                category: "Basic Compensation",
                isParent: true,
            },
            salaryType: {
                id: "salaryType",
                label: "Salary Type",
                category: "Basic Compensation",
            },
            payFrequency: {
                id: "payFrequency",
                label: "Pay Frequency",
                category: "Basic Compensation",
            },
            hourlyRate: {
                id: "hourlyRate",
                label: "Hourly Rate",
                category: "Basic Compensation",
            },
            dailyRate: {
                id: "dailyRate",
                label: "Daily Rate",
                category: "Basic Compensation",
            },
            monthlyRate: {
                id: "monthlyRate",
                label: "Monthly Rate",
                category: "Basic Compensation",
            },
            annualSalary: {
                id: "annualSalary",
                label: "Annual Salary",
                category: "Basic Compensation",
            },
        },
        additionalPay: {
            overtimePay: {
                id: "overtimePay",
                label: "Overtime Pay",
                category: "Additional Pay",
            },
            nightDifferential: {
                id: "nightDifferential",
                label: "Night Differential",
                category: "Additional Pay",
            },
            holidayPay: {
                id: "holidayPay",
                label: "Holiday Pay",
                category: "Additional Pay",
            },
            restDayPay: {
                id: "restDayPay",
                label: "Rest Day Pay",
                category: "Additional Pay",
            },
            hazardPay: {
                id: "hazardPay",
                label: "Hazard Pay",
                category: "Additional Pay",
            },
            otherEarnings: {
                id: "otherEarnings",
                label: "Other Earnings",
                category: "Additional Pay",
            },
        },
        bonusesAndBenefits: {
            thirteenthMonth: {
                id: "thirteenthMonth",
                label: "13th Month Pay",
                category: "Bonuses & Benefits",
            },
            bonus: {
                id: "bonus",
                label: "Bonus",
                category: "Bonuses & Benefits",
            },
        },
        deductions: {
            loanDeduction: {
                id: "loanDeduction",
                label: "Loan Deduction",
                category: "Deductions",
            },
            advancesDeduction: {
                id: "advancesDeduction",
                label: "Advances Deduction",
                category: "Deductions",
            },
            otherDeductions: {
                id: "otherDeductions",
                label: "Other Payroll Deductions",
                category: "Deductions",
            },
        },
        payrollSummary: {
            grossPay: {
                id: "grossPay",
                label: "Gross Pay",
                category: "Payroll Summary",
                isParent: true,
                dependents: ["taxableIncome", "withHoldingTax", "netPay"],
            },
            taxableIncome: {
                id: "taxableIncome",
                label: "Taxable Income",
                category: "Payroll Summary",
            },
            withHoldingTax: {
                id: "withHoldingTax",
                label: "Withholding Tax",
                category: "Payroll Summary",
            },
            netPay: {
                id: "netPay",
                label: "Net Pay",
                category: "Payroll Summary",
            },
        },
    },
    leavesPTO: {
        leaveSummary: {
            totalLeaveBalance: {
                id: "totalLeaveBalance",
                label: "Total Leave Balance",
                category: "Leave Summary",
                format: "days",
                isNumeric: true,
                showIcon: true,
                icon: "calendar",
            },
            leaveUsedYTD: {
                id: "leaveUsedYTD",
                label: "Leave Used (YTD)",
                category: "Leave Summary",
                format: "days",
                isNumeric: true,
            },
            leaveRemaining: {
                id: "leaveRemaining",
                label: "Leave Remaining",
                category: "Leave Summary",
                format: "days",
                isNumeric: true,
            },
            leaveAccrualRate: {
                id: "leaveAccrualRate",
                label: "Accrual Rate",
                category: "Leave Summary",
                format: "days/month",
                isNumeric: true,
            },
            nextScheduledLeave: {
                id: "nextScheduledLeave",
                label: "Next Scheduled Leave",
                category: "Leave Summary",
                format: "date",
            },
        },
        annualLeave: {
            annualLeaveBalance: {
                id: "annualLeaveBalance",
                label: "Annual Leave",
                category: "Annual Leave",
                isParent: true,
                isNumeric: true,
                format: "days",
                color: "#81c784", // Light green for vacation
                dependents: [
                    "annualLeaveEntitlement",
                    "annualLeaveUsed",
                    "annualLeaveRemaining",
                    "annualLeaveRequested",
                    "annualLeaveAccrued",
                    "annualLeaveExpiry",
                ],
            },
            annualLeaveEntitlement: {
                id: "annualLeaveEntitlement",
                label: "Entitlement",
                category: "Annual Leave",
                isDependentOf: "annualLeaveBalance",
                isNumeric: true,
                format: "days/year",
            },
            annualLeaveUsed: {
                id: "annualLeaveUsed",
                label: "Used",
                category: "Annual Leave",
                isDependentOf: "annualLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            annualLeaveRemaining: {
                id: "annualLeaveRemaining",
                label: "Remaining",
                category: "Annual Leave",
                isDependentOf: "annualLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            annualLeaveRequested: {
                id: "annualLeaveRequested",
                label: "Requested (Pending)",
                category: "Annual Leave",
                isDependentOf: "annualLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            annualLeaveAccrued: {
                id: "annualLeaveAccrued",
                label: "Accrued",
                category: "Annual Leave",
                isDependentOf: "annualLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            annualLeaveExpiry: {
                id: "annualLeaveExpiry",
                label: "Expiry Date",
                category: "Annual Leave",
                isDependentOf: "annualLeaveBalance",
                format: "date",
            },
        },
        sickLeave: {
            sickLeaveBalance: {
                id: "sickLeaveBalance",
                label: "Sick Leave",
                category: "Sick Leave",
                isParent: true,
                isNumeric: true,
                format: "days",
                color: "#ef9a9a", // Light red for sick leave
                dependents: [
                    "sickLeaveEntitlement",
                    "sickLeaveUsed",
                    "sickLeaveRemaining",
                    "sickLeaveDocumentation",
                    "sickLeaveIncidents",
                ],
            },
            sickLeaveEntitlement: {
                id: "sickLeaveEntitlement",
                label: "Entitlement",
                category: "Sick Leave",
                isDependentOf: "sickLeaveBalance",
                isNumeric: true,
                format: "days/year",
            },
            sickLeaveUsed: {
                id: "sickLeaveUsed",
                label: "Used",
                category: "Sick Leave",
                isDependentOf: "sickLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            sickLeaveRemaining: {
                id: "sickLeaveRemaining",
                label: "Remaining",
                category: "Sick Leave",
                isDependentOf: "sickLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            sickLeaveDocumentation: {
                id: "sickLeaveDocumentation",
                label: "Documentation Required",
                category: "Sick Leave",
                isDependentOf: "sickLeaveBalance",
                format: "boolean",
            },
            sickLeaveIncidents: {
                id: "sickLeaveIncidents",
                label: "Incidents (YTD)",
                category: "Sick Leave",
                isDependentOf: "sickLeaveBalance",
                isNumeric: true,
                format: "count",
            },
        },
        specialLeaves: {
            maternityLeaveBalance: {
                id: "maternityLeaveBalance",
                label: "Maternity Leave",
                category: "Special Leaves",
                isParent: true,
                isNumeric: true,
                format: "days",
                color: "#9575cd", // Light purple for maternity
                dependents: [
                    "maternityLeaveEntitlement",
                    "maternityLeaveUsed",
                    "maternityLeaveRemaining",
                    "maternityLeaveStartDate",
                    "maternityLeaveEndDate",
                ],
            },
            maternityLeaveEntitlement: {
                id: "maternityLeaveEntitlement",
                label: "Entitlement",
                category: "Special Leaves",
                isDependentOf: "maternityLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            maternityLeaveUsed: {
                id: "maternityLeaveUsed",
                label: "Used",
                category: "Special Leaves",
                isDependentOf: "maternityLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            maternityLeaveRemaining: {
                id: "maternityLeaveRemaining",
                label: "Remaining",
                category: "Special Leaves",
                isDependentOf: "maternityLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            maternityLeaveStartDate: {
                id: "maternityLeaveStartDate",
                label: "Start Date",
                category: "Special Leaves",
                isDependentOf: "maternityLeaveBalance",
                format: "date",
            },
            maternityLeaveEndDate: {
                id: "maternityLeaveEndDate",
                label: "End Date",
                category: "Special Leaves",
                isDependentOf: "maternityLeaveBalance",
                format: "date",
            },
            paternityLeaveBalance: {
                id: "paternityLeaveBalance",
                label: "Paternity Leave",
                category: "Special Leaves",
                isParent: true,
                isNumeric: true,
                format: "days",
                color: "#4fc3f7", // Light blue for paternity
                dependents: [
                    "paternityLeaveEntitlement",
                    "paternityLeaveUsed",
                    "paternityLeaveRemaining",
                ],
            },
            paternityLeaveEntitlement: {
                id: "paternityLeaveEntitlement",
                label: "Entitlement",
                category: "Special Leaves",
                isDependentOf: "paternityLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            paternityLeaveUsed: {
                id: "paternityLeaveUsed",
                label: "Used",
                category: "Special Leaves",
                isDependentOf: "paternityLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            paternityLeaveRemaining: {
                id: "paternityLeaveRemaining",
                label: "Remaining",
                category: "Special Leaves",
                isDependentOf: "paternityLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            bereavementLeaveBalance: {
                id: "bereavementLeaveBalance",
                label: "Bereavement Leave",
                category: "Special Leaves",
                isParent: true,
                isNumeric: true,
                format: "days",
                color: "#90a4ae", // Light gray for bereavement
                dependents: [
                    "bereavementLeaveEntitlement",
                    "bereavementLeaveUsed",
                    "bereavementLeaveRemaining",
                ],
            },
            bereavementLeaveEntitlement: {
                id: "bereavementLeaveEntitlement",
                label: "Entitlement",
                category: "Special Leaves",
                isDependentOf: "bereavementLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            bereavementLeaveUsed: {
                id: "bereavementLeaveUsed",
                label: "Used",
                category: "Special Leaves",
                isDependentOf: "bereavementLeaveBalance",
                isNumeric: true,
                format: "days",
            },
            bereavementLeaveRemaining: {
                id: "bereavementLeaveRemaining",
                label: "Remaining",
                category: "Special Leaves",
                isDependentOf: "bereavementLeaveBalance",
                isNumeric: true,
                format: "days",
            },
        },
        leaveTransactions: {
            totalLeaveTransactions: {
                id: "totalLeaveTransactions",
                label: "Leave Transactions",
                category: "Leave Transactions",
                hasTransactions: true,
                showIcon: true,
                icon: "history",
            },
            annualLeaveTransactions: {
                id: "annualLeaveTransactions",
                label: "Annual Leave Transactions",
                category: "Leave Transactions",
                hasTransactions: true,
            },
            sickLeaveTransactions: {
                id: "sickLeaveTransactions",
                label: "Sick Leave Transactions",
                category: "Leave Transactions",
                hasTransactions: true,
            },
        },
    },
};

// Helper function to get all columns as a flat array
export const getAllColumns = () => {
    const informationColumns = Object.values(columns.informationDetails).reduce(
        (acc, section) => [...acc, ...Object.values(section)],
        []
    );

    const compensationColumns = Object.values(
        columns.compensationPayroll
    ).reduce((acc, section) => [...acc, ...Object.values(section)], []);

    const leavesColumns = Object.values(columns.leavesPTO).reduce(
        (acc, section) => [...acc, ...Object.values(section)],
        []
    );

    return [...informationColumns, ...compensationColumns, ...leavesColumns];
};

// Helper function to get columns by category
export const getColumnsByCategory = () => {
    const categories = {};
    getAllColumns().forEach((column) => {
        if (!categories[column.category]) {
            categories[column.category] = [];
        }
        categories[column.category].push(column);
    });
    return categories;
};
