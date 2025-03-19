import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Calculator, GripHorizontal } from "lucide-react";

function ReportTable({ selectedColumns, getProcessedData, renderCellContent }) {
    // State to track expanded rows
    const [expandedRows, setExpandedRows] = useState({});
    // State to track expanded parent rows (for hierarchical data)
    const [expandedParents, setExpandedParents] = useState({});
    // State to track column calculations
    const [columnCalculations, setColumnCalculations] = useState({});
    // Modify the column ordering state to use a single state
    const [orderedColumns, setOrderedColumns] = useState(() => selectedColumns);
    // Add state for tracking dragged column
    const [draggedColumn, setDraggedColumn] = useState(null);

    // Update orderedColumns when selectedColumns changes
    useEffect(() => {
        // Memoize the current IDs outside the state updates
        const currentIds = new Set(orderedColumns.map((col) => col.id));
        const selectedIds = new Set(selectedColumns.map((col) => col.id));

        // Only update if there's an actual difference in columns
        if (
            currentIds.size !== selectedIds.size ||
            ![...currentIds].every((id) => selectedIds.has(id))
        ) {
            setOrderedColumns((prevColumns) => {
                // Keep existing columns that are still in selectedColumns
                const existingColumns = prevColumns.filter((col) =>
                    selectedColumns.some((newCol) => newCol.id === col.id)
                );
                // Find new columns to add
                const newColumns = selectedColumns.filter(
                    (col) => !currentIds.has(col.id)
                );
                // Combine existing (maintaining order) with new columns
                return [...existingColumns, ...newColumns];
            });
        }
    }, [selectedColumns, orderedColumns]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update column order when columns are reordered
    const handleReorder = (reorderedColumns) => {
        setOrderedColumns(reorderedColumns);
    };

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

    // Set calculation type for a column
    const setCalculationForColumn = (columnId, calculationType) => {
        setColumnCalculations((prev) => ({
            ...prev,
            [columnId]: calculationType,
        }));
    };

    // Clear calculation for a column
    const clearCalculation = (columnId) => {
        setColumnCalculations((prev) => {
            const newCalculations = { ...prev };
            delete newCalculations[columnId];
            return newCalculations;
        });
    };

    // Filter out dependent columns whose parents are not selected
    const visibleColumns = orderedColumns.filter((column) => {
        if (column.isDependentOf) {
            return orderedColumns.some(
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
        return Boolean(
            parentChildMap[rowId] && parentChildMap[rowId].length > 0
        );
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
        // Check if content is a long email address
        const isLongText =
            typeof row[column.id] === "string" && row[column.id]?.length > 25;
        const isEmail =
            typeof row[column.id] === "string" && row[column.id]?.includes("@");
        const contentClass = isLongText
            ? isEmail
                ? "break-all"
                : "break-words"
            : "";

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
                    <div className={`cell-content ${contentClass}`}>
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
                        <div className={`cell-primary-content ${contentClass}`}>
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
                        <div className={`cell-primary-content ${contentClass}`}>
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
        return (
            <div className={contentClass}>{renderCellContent(row, column)}</div>
        );
    };

    // Calculate column values based on selected calculation type
    const calculateColumnValue = (columnId) => {
        const calculationType = columnCalculations[columnId];
        if (!calculationType) return null;

        // Get all values for the column
        const allValues = data
            .map((row) => row[columnId])
            .filter((value) => value !== null && value !== undefined);

        // For Count, we want to count all non-null values
        if (calculationType === "Count") {
            return {
                type: calculationType,
                value: allValues.length.toLocaleString(),
            };
        }

        // For numeric calculations, filter for numbers only
        const numericValues = allValues.filter(
            (value) => typeof value === "number"
        );

        if (numericValues.length === 0)
            return { type: calculationType, value: "—" };

        // Perform calculation based on type
        let result;
        switch (calculationType) {
            case "Sum":
                result = numericValues.reduce((sum, value) => sum + value, 0);
                break;
            case "Average":
                result =
                    numericValues.reduce((sum, value) => sum + value, 0) /
                    numericValues.length;
                break;
            case "Median":
                const sorted = [...numericValues].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                result =
                    sorted.length % 2 === 0
                        ? (sorted[mid - 1] + sorted[mid]) / 2
                        : sorted[mid];
                break;
            case "Min":
                result = Math.min(...numericValues);
                break;
            case "Max":
                result = Math.max(...numericValues);
                break;
            case "Range":
                result =
                    Math.max(...numericValues) - Math.min(...numericValues);
                break;
            default:
                return null;
        }

        return {
            type: calculationType,
            value:
                typeof result === "number" ? result.toLocaleString() : result,
        };
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
                        ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        border-b border-gray-100 hover:bg-gray-100 transition-colors duration-150
                    `}
                >
                    {visibleColumns.map((column) => {
                        // Determine cell styling based on content type
                        const isEmailColumn = column.id
                            .toLowerCase()
                            .includes("email");
                        const isAddressColumn =
                            column.id.toLowerCase().includes("address") ||
                            column.id.toLowerCase().includes("location") ||
                            column.id === "currentAddress";

                        return (
                            <td
                                key={column.id}
                                className={`
                                    ${level > 0 ? "child-cell" : ""}
                                    ${
                                        row.isTransactionRow
                                            ? "transaction-cell"
                                            : ""
                                    }
                                    ${isEmailColumn ? "break-all" : ""}
                                    ${
                                        isAddressColumn
                                            ? "whitespace-normal break-words"
                                            : ""
                                    }
                                    !min-w-32 w-32 py-4 px-4
                                `}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={column.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeOut",
                                            exit: { ease: "easeIn" },
                                        }}
                                        className={`${
                                            isAddressColumn ? "text-sm" : ""
                                        } ${isEmailColumn ? "truncate" : ""}`}
                                    >
                                        {renderEnhancedCellContent(
                                            row,
                                            column,
                                            rowIndex
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </td>
                        );
                    })}
                </tr>,
            ];

            // If expanded and has children, render them
            if (isExpanded && children.length > 0) {
                result.push(...renderRowsRecursively(children, level + 1));
            }

            return result;
        });
    };

    // Modify renderCalculationDropdown to handle column types
    const renderCalculationDropdown = (columnId) => {
        const currentCalculation = columnCalculations[columnId];

        // Helper function to check if column contains only string values
        const isStringColumn = () => {
            const data = getProcessedData();
            return data.every((row) => {
                const value = row[columnId];
                return (
                    typeof value === "string" ||
                    value === null ||
                    value === undefined
                );
            });
        };

        // Define all calculation options
        const allCalculationOptions = [
            { value: null, label: "None" },
            { value: "Sum", label: "Sum", numericOnly: true },
            { value: "Average", label: "Average", numericOnly: true },
            { value: "Median", label: "Median", numericOnly: true },
            { value: "Min", label: "Min", numericOnly: true },
            { value: "Max", label: "Max", numericOnly: true },
            { value: "Range", label: "Range", numericOnly: true },
            { value: "Count", label: "Count", numericOnly: false },
        ];

        // Filter options based on column type
        const isString = isStringColumn();
        const calculationOptions = allCalculationOptions.filter(
            (option) => !option.numericOnly || !isString
        );

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 flex items-center px-2 rounded bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                    >
                        <Calculator className="h-3.5 w-3.5 mr-1" />
                        {currentCalculation || "Calculate"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="top"
                    align="end"
                    className="w-[180px]"
                    sideOffset={5}
                >
                    <DropdownMenuLabel>Choose calculation</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                        value={currentCalculation}
                        onValueChange={(value) => {
                            if (value === "null") {
                                clearCalculation(columnId);
                            } else {
                                setCalculationForColumn(columnId, value);
                            }
                        }}
                    >
                        {calculationOptions.map((option) => (
                            <DropdownMenuRadioItem
                                key={option.value || "null"}
                                value={option.value || "null"}
                            >
                                {option.label}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <div className="table-container rounded-lg border border-gray-200 overflow-x-auto max-w-full relative">
            {visibleColumns.length > 0 ? (
                <table
                    className="report-table w-full border-collapse"
                    style={{ minWidth: `${visibleColumns.length * 8}rem` }}
                >
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <Reorder.Group
                            as="tr"
                            axis="x"
                            values={visibleColumns}
                            onReorder={handleReorder}
                        >
                            {visibleColumns.map((column) => (
                                <Reorder.Item
                                    as="th"
                                    key={column.id}
                                    value={column}
                                    className={`
                                        !min-w-32 w-32 py-3 px-4 
                                        text-left font-medium text-gray-700 
                                        border-b border-gray-100 
                                        truncate cursor-move relative group
                                        select-none
                                    `}
                                    whileDrag={{
                                        scale: 1.02,
                                        backgroundColor: "rgb(243 244 246)",
                                        zIndex: 20,
                                    }}
                                    onDragStart={() =>
                                        setDraggedColumn(column.id)
                                    }
                                    onDragEnd={() => setDraggedColumn(null)}
                                    layout
                                    transition={{
                                        layout: {
                                            duration: 0.2,
                                            ease: "easeOut",
                                        },
                                    }}
                                >
                                    <div className="column-header truncate flex items-center gap-2 min-w-0 w-full">
                                        <div className="drag-handle opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <GripHorizontal className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <motion.div
                                            className="column-label truncate font-medium text-gray-700 w-full"
                                            layout="position"
                                            transition={{
                                                layout: {
                                                    duration: 0.2,
                                                    ease: "easeOut",
                                                },
                                            }}
                                        >
                                            {column.label}
                                        </motion.div>
                                    </div>
                                    {draggedColumn === column.id && (
                                        <motion.div
                                            className="absolute left-0 top-0 w-full bg-gray-100/50 border-x-2 border-blue-500"
                                            initial={{ height: 0 }}
                                            animate={{
                                                height: "100vh",
                                                transition: { duration: 0.2 },
                                            }}
                                            style={{
                                                pointerEvents: "none",
                                                zIndex: 10,
                                            }}
                                        />
                                    )}
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </thead>
                    <tbody>
                        {topLevelRows.length > 0 ? (
                            renderRowsRecursively(topLevelRows)
                        ) : (
                            <tr>
                                <td
                                    colSpan={visibleColumns.length}
                                    className="min-w-32 py-4 px-4 text-center text-gray-500 border-b border-gray-100"
                                >
                                    No data to display
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="calculation-row border-t bg-gray-50 sticky bottom-0 z-10 shadow-[0_-1px_2px_rgba(0,0,0,0.05)]">
                            {visibleColumns.map((column) => {
                                const calculation =
                                    Object.keys(columnCalculations).length > 0
                                        ? calculateColumnValue(column.id)
                                        : null;

                                return (
                                    <td
                                        key={`calc-${column.id}`}
                                        className="!min-w-32 w-32 py-3 px-4 text-sm relative group/cell"
                                        style={{
                                            width: `${
                                                100 / visibleColumns.length
                                            }%`,
                                        }}
                                    >
                                        <div className="flex items-center min-w-0">
                                            <div className="absolute left-2 ml-1.5 opacity-0 group-hover/cell:opacity-100 transition-opacity duration-150 flex-shrink-0 z-10">
                                                {renderCalculationDropdown(
                                                    column.id
                                                )}
                                            </div>

                                            {calculation ? (
                                                <div className="calculation-result truncate bg-green-50 p-1 px-2 rounded-md group-hover/cell:opacity-0 transition-opacity duration-150 font-medium">
                                                    <span className="text-green-700">
                                                        {calculation.value}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`text-gray-400 italic truncate group-hover/cell:opacity-0 transition-opacity duration-150 ${
                                                        column ===
                                                            visibleColumns[0] &&
                                                        !Object.keys(
                                                            columnCalculations
                                                        ).length
                                                            ? "visible"
                                                            : "invisible"
                                                    }`}
                                                >
                                                    {column ===
                                                        visibleColumns[0] &&
                                                    !Object.keys(
                                                        columnCalculations
                                                    ).length
                                                        ? "Configure calculations"
                                                        : "—"}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tfoot>
                </table>
            ) : (
                <div className="no-columns-message p-8 text-center text-gray-500">
                    <p>Please select columns to display</p>
                </div>
            )}
        </div>
    );
}

export default ReportTable;
