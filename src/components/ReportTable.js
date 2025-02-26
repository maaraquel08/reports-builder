import React, { useState } from "react";

function ReportTable({ selectedColumns, getProcessedData, renderCellContent }) {
    // State to track expanded rows
    const [expandedRows, setExpandedRows] = useState({});
    // State to track expanded parent rows (for hierarchical data)
    const [expandedParents, setExpandedParents] = useState({});

    // Toggle row expansion for cell details
    const toggleRowExpansion = (rowId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };

    // Toggle parent row to show/hide children
    const toggleParentRow = (parentId) => {
        setExpandedParents((prev) => ({
            ...prev,
            [parentId]: !prev[parentId],
        }));
    };

    // Filter out dependent columns whose parents are not selected
    const visibleColumns = selectedColumns.filter((column) => {
        if (column.isDependentOf) {
            return selectedColumns.some(
                (col) => col.id === column.isDependentOf
            );
        }
        return true;
    });

    const data = getProcessedData();

    // Process data to identify parent-child relationships
    const processHierarchicalData = () => {
        // Create a map of parent IDs to their children
        const parentChildMap = {};
        // Track all child IDs to filter them out of the top level
        const childIds = new Set();

        // First pass: identify parent-child relationships
        data.forEach((row) => {
            if (row.parentId) {
                childIds.add(row.id);
                if (!parentChildMap[row.parentId]) {
                    parentChildMap[row.parentId] = [];
                }
                parentChildMap[row.parentId].push(row);
            }
        });

        // Second pass: create hierarchical structure
        const topLevelRows = data.filter((row) => !childIds.has(row.id));

        return { topLevelRows, parentChildMap };
    };

    const { topLevelRows, parentChildMap } = processHierarchicalData();

    // Check if a row has children
    const hasChildren = (rowId) => {
        return parentChildMap[rowId] && parentChildMap[rowId].length > 0;
    };

    // Modify the hasExpandableLeaveData function to include totalLeaveBalance
    const hasExpandableLeaveData = (row, column) => {
        return (
            // Check if it's a leave balance column
            (column.id === "totalLeaveBalance" ||
                column.id.includes("LeaveBalance")) &&
            // Check if we have breakdown data available
            row.leaveTypeBreakdown &&
            Object.keys(row.leaveTypeBreakdown).length > 0
        );
    };

    // Create a new function to render leave balance breakdown
    const renderLeaveBalanceBreakdown = (row) => {
        if (!row.leaveTypeBreakdown) return null;

        return (
            <div className="leave-breakdown">
                <h4>Leave Balance Breakdown</h4>
                <ul className="leave-breakdown-list">
                    {Object.entries(row.leaveTypeBreakdown).map(
                        ([type, balance]) => (
                            <li key={type} className="leave-breakdown-item">
                                <span className="leave-type">{type}</span>
                                <span className="leave-days">
                                    {balance} {balance === 1 ? "day" : "days"}
                                </span>
                            </li>
                        )
                    )}
                </ul>
            </div>
        );
    };

    // Update the hasTransactionData function to check for both array and object types
    const hasTransactionData = (row, column) => {
        return (
            // Check if it's a transaction column
            (column.hasTransactions || column.id.includes("Transactions")) &&
            // Check if we have transaction data available
            row[column.id] &&
            (Array.isArray(row[column.id]) ? row[column.id].length > 0 : false)
        );
    };

    // Update the renderTransactionData function to handle different data formats
    const renderTransactionData = (row, column) => {
        const transactions = row[column.id];
        if (
            !transactions ||
            !Array.isArray(transactions) ||
            transactions.length === 0
        )
            return null;

        // Check what properties are available in the first transaction
        const firstTx = transactions[0];
        const hasLeaveType = "leaveType" in firstTx;
        const hasDescription = "description" in firstTx;
        const hasStatus = "status" in firstTx;
        const hasApprovedBy = "approvedBy" in firstTx;

        return (
            <div className="leave-transactions">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            {hasLeaveType && <th>Leave Type</th>}
                            {hasDescription && <th>Description</th>}
                            <th>Amount</th>
                            <th>Balance</th>
                            {hasStatus && <th>Status</th>}
                            {hasApprovedBy && <th>Approved By</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((trx) => (
                            <tr
                                key={trx.id}
                                className={`transaction-row ${trx.type.toLowerCase()}`}
                            >
                                <td className="transaction-date">{trx.date}</td>
                                <td
                                    className={`transaction-type ${trx.type.toLowerCase()}`}
                                >
                                    {trx.type}
                                </td>
                                {hasLeaveType && (
                                    <td>{trx.leaveType || "-"}</td>
                                )}
                                {hasDescription && (
                                    <td>{trx.description || "-"}</td>
                                )}
                                <td
                                    className={`transaction-amount ${trx.type.toLowerCase()}`}
                                >
                                    {trx.type === "Credit" ? "+" : ""}
                                    {trx.amount}
                                </td>
                                <td>{trx.balance}</td>
                                {hasStatus && (
                                    <td className="transaction-status">
                                        {trx.status || "-"}
                                    </td>
                                )}
                                {hasApprovedBy && (
                                    <td>{trx.approvedBy || "-"}</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Modify the renderEnhancedCellContent function for transaction cells
    const renderEnhancedCellContent = (row, column, rowIndex) => {
        // If this is the first column and row has children, add toggle
        if (column === visibleColumns[0] && hasChildren(row.id)) {
            const isParentExpanded = expandedParents[row.id];

            return (
                <div className="hierarchical-cell">
                    <button
                        className={`hierarchy-toggle ${
                            isParentExpanded ? "expanded" : ""
                        }`}
                        onClick={() => toggleParentRow(row.id)}
                        aria-label={
                            isParentExpanded
                                ? "Collapse children"
                                : "Expand children"
                        }
                    >
                        <span className="toggle-icon"></span>
                    </button>
                    <div className="cell-content">
                        {renderCellContent(row, column)}
                    </div>
                </div>
            );
        }

        // If this cell has expandable leave balance data
        if (hasExpandableLeaveData(row, column)) {
            const isExpanded = expandedRows[`${rowIndex}-${column.id}`];

            return (
                <div className="expandable-cell">
                    <div className="cell-content-wrapper">
                        <button
                            className={`expand-toggle ${
                                isExpanded ? "expanded" : ""
                            }`}
                            onClick={() =>
                                toggleRowExpansion(`${rowIndex}-${column.id}`)
                            }
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                            <span className="toggle-icon"></span>
                        </button>
                        <div className="cell-primary-content">
                            {renderCellContent(row, column)}
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="expanded-content">
                            {renderLeaveBalanceBreakdown(row)}
                        </div>
                    )}
                </div>
            );
        }

        // If this cell has transaction data
        if (hasTransactionData(row, column)) {
            const isExpanded = expandedRows[`${rowIndex}-${column.id}`];

            return (
                <div className="expandable-cell">
                    <div className="cell-content-wrapper">
                        <button
                            className={`expand-toggle ${
                                isExpanded ? "expanded" : ""
                            }`}
                            onClick={() =>
                                toggleRowExpansion(`${rowIndex}-${column.id}`)
                            }
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                            <span className="toggle-icon"></span>
                        </button>
                        <div className="cell-primary-content">
                            {renderCellContent(row, column)}
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="expanded-content">
                            {renderTransactionData(row, column)}
                        </div>
                    )}
                </div>
            );
        }

        // Default rendering for other cells
        return renderCellContent(row, column);
    };

    // Recursive function to render rows with their children
    const renderRowsRecursively = (rows, level = 0) => {
        return rows.flatMap((row, rowIndex) => {
            const rowKey = `row-${level}-${rowIndex}`;
            const children = parentChildMap[row.id] || [];
            const isExpanded = expandedParents[row.id];

            const result = [
                <tr
                    key={rowKey}
                    className={`
                        ${row.isAggregated ? "aggregated-row" : ""} 
                        ${level > 0 ? "child-row level-" + level : ""}
                        ${row.isTransactionRow ? "transaction-row-tr" : ""}
                    `}
                >
                    {visibleColumns.map((column) => (
                        <td
                            key={column.id}
                            className={`
                                ${level > 0 ? "child-cell" : ""}
                                ${
                                    row.isTransactionRow
                                        ? "transaction-cell"
                                        : ""
                                }
                            `}
                        >
                            {renderEnhancedCellContent(row, column, rowIndex)}
                        </td>
                    ))}
                </tr>,
            ];

            // If expanded and has children, render them
            if (isExpanded && children.length > 0) {
                result.push(...renderRowsRecursively(children, level + 1));
            }

            return result;
        });
    };

    return (
        <div className="table-container">
            {visibleColumns.length > 0 ? (
                <table className="report-table">
                    <thead>
                        <tr>
                            {visibleColumns.map((column) => (
                                <th key={column.id}>{column.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {topLevelRows.length > 0 ? (
                            renderRowsRecursively(topLevelRows)
                        ) : (
                            <tr>
                                <td
                                    colSpan={visibleColumns.length}
                                    className="no-data"
                                >
                                    No data to display
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : (
                <div className="no-columns-message">
                    <p>Please select columns to display</p>
                </div>
            )}
        </div>
    );
}

export default ReportTable;
