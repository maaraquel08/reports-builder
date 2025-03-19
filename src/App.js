import React, { useState } from "react";
import "./App.css";
import { columns } from "./data/column";
import { employees } from "./data/sampleData";
import SidePanel from "./components/SidePanel";
import Filters from "./components/Filters";
import ReportTable from "./components/ReportTable";
import * as XLSX from "xlsx";

function App() {
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [currentOrderedColumns, setCurrentOrderedColumns] = useState([]);
    const [expandedSections, setExpandedSections] = useState(
        Object.keys(columns).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    const [expandedCategories, setExpandedCategories] = useState({});
    const [showDetailedView] = useState(false);
    const [filters, setFilters] = useState({
        department: "",
        employmentStatus: "",
        dateRange: {
            start: "",
            end: "",
        },
    });
    const [aggregateBy, setAggregateBy] = useState("");
    const [currentCalculations, setCurrentCalculations] = useState({});

    const handleColumnToggle = (column) => {
        if (selectedColumns.find((col) => col.id === column.id)) {
            // If turning off a parent column, remove its dependents too
            if (column.isParent) {
                const dependentsToRemove = column.dependents || [];
                const newColumns = selectedColumns.filter(
                    (col) =>
                        col.id !== column.id &&
                        !dependentsToRemove.includes(col.id)
                );
                setSelectedColumns(newColumns);
                setCurrentOrderedColumns(newColumns);
            } else {
                // Just remove this single column
                const newColumns = selectedColumns.filter(
                    (col) => col.id !== column.id
                );
                setSelectedColumns(newColumns);
                setCurrentOrderedColumns(newColumns);
            }
        } else {
            // If turning on a column, just add it without auto-selecting dependents
            const newColumns = [...selectedColumns, column];
            setSelectedColumns(newColumns);
            setCurrentOrderedColumns(newColumns);
        }
    };

    const clearAllColumns = () => {
        setSelectedColumns([]);
        setCurrentOrderedColumns([]);
    };

    const isColumnEnabled = (column) => {
        if (column.isDependentOf) {
            // Check if parent is selected
            return selectedColumns.some(
                (col) => col.id === column.isDependentOf
            );
        }
        return true;
    };

    const toggleMainSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const toggleCategory = (category) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const formatSectionTitle = (section) => {
        return section
            .replace(/([A-Z])/g, " $1")
            .trim()
            .replace(/^./, (str) => str.toUpperCase());
    };

    const getFilteredData = () => {
        let filteredData = [...employees];

        // Apply filters
        if (filters.department) {
            filteredData = filteredData.filter(
                (emp) => emp.department === filters.department
            );
        }
        if (filters.employmentStatus) {
            filteredData = filteredData.filter(
                (emp) => emp.employmentStatus === filters.employmentStatus
            );
        }
        if (filters.dateRange.start && filters.dateRange.end) {
            filteredData = filteredData.filter((emp) => {
                const hireDate = new Date(emp.dateHired);
                return (
                    hireDate >= new Date(filters.dateRange.start) &&
                    hireDate <= new Date(filters.dateRange.end)
                );
            });
        }

        return filteredData;
    };

    const getProcessedData = () => {
        // First apply filters
        let processedData = getFilteredData();

        // Handle aggregation if selected
        if (aggregateBy) {
            const aggregated = processedData.reduce((acc, row) => {
                const key = row[aggregateBy];
                if (!acc[key]) {
                    acc[key] = {
                        ...row,
                        isAggregated: true,
                        aggregateKey: key,
                        count: 1,
                    };
                } else {
                    acc[key].count += 1;
                    // Aggregate numeric values
                    selectedColumns.forEach((column) => {
                        if (typeof row[column.id] === "number") {
                            acc[key][column.id] =
                                (acc[key][column.id] || 0) + row[column.id];
                        }
                    });
                }
                return acc;
            }, {});

            processedData = Object.values(aggregated);
        }

        // Then handle expanded rows if in detailed view
        if (showDetailedView) {
            processedData = processedData.reduce((acc, row) => {
                // Add the main row
                acc.push(row);

                // Only expand non-aggregated rows
                if (!row.isAggregated) {
                    // Check for leave history data
                    if (
                        row.leaveHistoryYTD &&
                        Array.isArray(row.leaveHistoryYTD) &&
                        row.leaveHistoryYTD.length > 0
                    ) {
                        // Add each leave history item as a transaction row
                        row.leaveHistoryYTD.forEach((leave) => {
                            acc.push({
                                ...row,
                                isTransactionRow: true,
                                transactionData: {
                                    id: leave.id,
                                    date: `${leave.startDate} to ${leave.endDate}`,
                                    type: leave.type,
                                    amount: leave.days,
                                    status: leave.status,
                                    note: leave.note || "",
                                },
                                transactionType: "leaveUsedYTD",
                            });
                        });
                    }

                    // You can add similar code for other transaction types if needed
                    // For example, for leave transactions:
                    if (
                        row.totalLeaveTransactions &&
                        Array.isArray(row.totalLeaveTransactions)
                    ) {
                        row.totalLeaveTransactions.forEach((transaction) => {
                            acc.push({
                                ...row,
                                isTransactionRow: true,
                                transactionData: transaction,
                                transactionType: "totalLeaveBalance",
                            });
                        });
                    }
                }

                return acc;
            }, []);
        }

        return processedData;
    };

    const renderCellContent = (row, column) => {
        // Handle aggregated rows
        if (row.isAggregated) {
            if (column.id === aggregateBy) {
                return `${row[column.id]} (${row.count} employees)`;
            }
            if (typeof row[column.id] === "number") {
                // For numeric values, show the total
                return row[column.id].toLocaleString();
            }
            return "—"; // For non-numeric values in aggregated rows
        }

        // Handle transaction rows
        if (row.isTransactionRow) {
            // For the transaction type column, show the transaction details
            if (
                column.id === row.transactionType ||
                (column.id === "leaveUsedYTD" &&
                    row.transactionType === "leaveUsedYTD")
            ) {
                return (
                    <div className="transaction-row">
                        <div className="transaction-date">
                            {row.transactionData.date}
                        </div>
                        <div className="transaction-type">
                            {row.transactionData.type}
                        </div>
                        <div className="transaction-amount">
                            {row.transactionData.amount}
                        </div>
                        {row.transactionData.status && (
                            <div className="transaction-status">
                                {row.transactionData.status}
                            </div>
                        )}
                        {row.transactionData.note && (
                            <div className="transaction-note">
                                {row.transactionData.note}
                            </div>
                        )}
                    </div>
                );
            }

            // For the employee name column in transaction rows, add indentation
            if (
                column.id === "fullName" ||
                column.id === "firstName" ||
                column.id === "lastName"
            ) {
                return (
                    <div className="indented-transaction-cell">
                        <span className="transaction-indicator">↳</span>
                        <span className="transaction-label">Leave: </span>
                        {row.transactionData.type}
                    </div>
                );
            }

            // For other columns in transaction rows, show a dash
            return "—";
        }

        // Regular row - check if the value is an object or array
        const value = row[column.id];

        // If it's an array, show the count
        if (Array.isArray(value)) {
            return `${value.length} items`;
        }

        // If it's an object but not a React element, convert to string or show placeholder
        if (
            value !== null &&
            typeof value === "object" &&
            !React.isValidElement(value)
        ) {
            // For objects like leaveTypeBreakdown, show a summary
            if (
                column.id === "leaveTypeBreakdown" ||
                column.id === "leaveBreakdown"
            ) {
                return `${Object.keys(value).length} types`;
            }
            return "(Object)";
        }

        // Return the value directly if it's a primitive type
        return value;
    };

    // Add this function to get unique values for filter dropdowns
    const getUniqueValues = (field) => {
        return [...new Set(employees.map((emp) => emp[field]))].filter(Boolean);
    };

    const handleOrderChange = (newOrder, calculations) => {
        setCurrentOrderedColumns(newOrder);
        if (calculations) {
            setCurrentCalculations(calculations);
        }
    };

    const handleDownload = () => {
        const data = getProcessedData();

        // Use the current ordered columns instead of selectedColumns
        const columnsToUse =
            currentOrderedColumns.length > 0
                ? currentOrderedColumns
                : selectedColumns;

        // Create worksheet data with headers
        const wsData = [
            // Headers row using ordered columns
            columnsToUse.map((col) => col.label),
            // Data rows using ordered columns
            ...data.map((row) =>
                columnsToUse.map((col) => {
                    const cellContent = row[col.id];
                    if (Array.isArray(cellContent)) {
                        return `${cellContent.length} items`;
                    } else if (
                        cellContent &&
                        typeof cellContent === "object" &&
                        !React.isValidElement(cellContent)
                    ) {
                        return JSON.stringify(cellContent);
                    }
                    return cellContent || "";
                })
            ),
            // Add a blank row as separator
            columnsToUse.map(() => ""),
            // Add calculations row with labels
            columnsToUse.map((col) => {
                const calculation = currentCalculations[col.id];
                if (calculation) {
                    return `${calculation.type}: ${calculation.value}`;
                }
                return "—";
            }),
        ];

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Style the calculations row
        const lastRowIndex = wsData.length;
        const range = XLSX.utils.decode_range(ws["!ref"]);

        // Add cell styling for the calculation row
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellRef = XLSX.utils.encode_cell({
                r: lastRowIndex - 1,
                c: C,
            });
            if (!ws[cellRef]) ws[cellRef] = {};
            ws[cellRef].s = {
                fill: { fgColor: { rgb: "E8F5E9" } }, // Light green background
                font: { bold: true, color: { rgb: "1B5E20" } }, // Dark green text
            };
        }

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");

        // Generate Excel file with timestamp
        const timestamp = new Date().toISOString().split("T")[0];
        XLSX.writeFile(wb, `employee_report_${timestamp}.xlsx`);
    };

    return (
        <div className="App">
            <div className="app-container max-w-[1320px] mx-auto flex flex-col">
                <main className="main-content border border-gray-200 rounded-3xl overscroll-none flex flex-col h-full overflow-hidden">
                    <div className="report-header flex flex-row justify-between">
                        <Filters
                            filters={filters}
                            setFilters={setFilters}
                            aggregateBy={aggregateBy}
                            setAggregateBy={setAggregateBy}
                            getUniqueValues={getUniqueValues}
                        />
                        <div className="column-counter ">
                            <span className="counter-text bg-green-50 text-green-700 font-">
                                {selectedColumns.length} columns selected
                            </span>
                            {selectedColumns.length > 0 && (
                                <>
                                    <button
                                        className="clear-button"
                                        onClick={clearAllColumns}
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        className="clear-button"
                                        onClick={handleDownload}
                                        style={{
                                            backgroundColor: "#17ad49",
                                            color: "white",
                                            border: "none",
                                        }}
                                    >
                                        Download
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex h-full overflow-hidden">
                        <SidePanel
                            columns={columns}
                            selectedColumns={selectedColumns}
                            expandedSections={expandedSections}
                            expandedCategories={expandedCategories}
                            handleColumnToggle={handleColumnToggle}
                            toggleMainSection={toggleMainSection}
                            toggleCategory={toggleCategory}
                            isColumnEnabled={isColumnEnabled}
                            formatSectionTitle={formatSectionTitle}
                        />
                        <div className="report-builder w-full p-4 overflow-auto">
                            <ReportTable
                                selectedColumns={selectedColumns}
                                getProcessedData={getProcessedData}
                                renderCellContent={renderCellContent}
                                onOrderChange={handleOrderChange}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
