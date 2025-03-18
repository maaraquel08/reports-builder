import React from "react";

function Filters({
    filters,
    setFilters,
    aggregateBy,
    setAggregateBy,
    getUniqueValues,
}) {
    return (
        <div className="filter-section">
            <div className="filter-controls flex">
                <div className="filter-group">
                    <select
                        value={filters.department}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                department: e.target.value,
                            })
                        }
                    >
                        <option value="">All Departments</option>
                        {getUniqueValues("department").map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <select
                        value={filters.employmentStatus}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                employmentStatus: e.target.value,
                            })
                        }
                    >
                        <option value="">All Statuses</option>
                        {getUniqueValues("employmentStatus").map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group filter-date">
                    <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                dateRange: {
                                    ...filters.dateRange,
                                    start: e.target.value,
                                },
                            })
                        }
                        placeholder="Start Date"
                    />
                </div>

                <div className="filter-group filter-date">
                    <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                dateRange: {
                                    ...filters.dateRange,
                                    end: e.target.value,
                                },
                            })
                        }
                        placeholder="End Date"
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={aggregateBy}
                        onChange={(e) => setAggregateBy(e.target.value)}
                    >
                        <option value="">No Aggregation</option>
                        <option value="department">Department</option>
                        <option value="employmentStatus">
                            Employment Status
                        </option>
                        <option value="position">Position</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default Filters;
