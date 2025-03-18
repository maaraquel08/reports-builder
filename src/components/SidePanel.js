import React, { useEffect, useRef, useState } from "react";

function SidePanel({
    columns,
    selectedColumns,
    expandedSections,
    expandedCategories,
    handleColumnToggle,
    toggleMainSection,
    toggleCategory,
    isColumnEnabled,
    formatSectionTitle,
}) {
    // Add state for search query
    const [searchQuery, setSearchQuery] = useState("");
    // Add state to track which sections have search results
    const [sectionsWithResults, setSectionsWithResults] = useState({});
    // Add state to track which categories have search results
    const [categoriesWithResults, setCategoriesWithResults] = useState({});

    // Use a ref to track previous selections
    const previousSelectionsRef = useRef({});

    // Update the ref when selections change
    useEffect(() => {
        // Create a map of all dependents by their parent
        const dependentsByParent = {};

        // Iterate through all columns to find parent-child relationships
        for (const sectionKey in columns) {
            const section = columns[sectionKey];
            for (const categoryKey in section) {
                const category = section[categoryKey];
                for (const colKey in category) {
                    const column = category[colKey];

                    // If this is a dependent column and its parent is selected
                    if (
                        column.isDependentOf &&
                        selectedColumns.some(
                            (col) => col.id === column.isDependentOf
                        )
                    ) {
                        // Check if this dependent is selected
                        const isSelected = selectedColumns.some(
                            (col) => col.id === column.id
                        );

                        if (isSelected) {
                            // Save this as a selected dependent for its parent
                            if (!dependentsByParent[column.isDependentOf]) {
                                dependentsByParent[column.isDependentOf] = [];
                            }
                            dependentsByParent[column.isDependentOf].push(
                                column.id
                            );
                        }
                    }
                }
            }
        }

        // Update our ref with the current selection state
        previousSelectionsRef.current = dependentsByParent;
    }, [selectedColumns, columns]);

    // Add effect to update search results when search query changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            // If search is empty, clear results
            setSectionsWithResults({});
            setCategoriesWithResults({});
            return;
        }

        const query = searchQuery.toLowerCase();
        const matchingSections = {};
        const matchingCategories = {};

        // Search through all columns
        for (const sectionKey in columns) {
            const section = columns[sectionKey];
            let sectionHasMatches = false;

            for (const categoryKey in section) {
                const category = section[categoryKey];
                let categoryHasMatches = false;

                for (const colKey in category) {
                    const column = category[colKey];
                    // Check if column label matches search query
                    if (column.label.toLowerCase().includes(query)) {
                        categoryHasMatches = true;
                        sectionHasMatches = true;
                    }
                }

                if (categoryHasMatches) {
                    matchingCategories[categoryKey] = true;
                }
            }

            if (sectionHasMatches) {
                matchingSections[sectionKey] = true;
            }
        }

        setSectionsWithResults(matchingSections);
        setCategoriesWithResults(matchingCategories);
    }, [searchQuery, columns]);

    // Only toggle the column that was clicked
    const handleColumnClick = (column) => {
        // Use the regular toggle function
        handleColumnToggle(column);
    };

    const renderColumns = (categoryColumns) => {
        return (
            <div className="columns-list">
                {Object.values(categoryColumns).map((column) => {
                    const isDependent = column.isDependentOf;
                    const isParent = column.isParent;

                    // Check if the parent is selected (for dependent columns)
                    const isParentSelected =
                        !isDependent ||
                        selectedColumns.some(
                            (col) => col.id === column.isDependentOf
                        );

                    // Column is enabled if it's not a dependent OR if its parent is selected
                    const isEnabled = isColumnEnabled(column);

                    const isSelected = selectedColumns.some(
                        (col) => col.id === column.id
                    );

                    // Check if this column matches the search query
                    const matchesSearch =
                        !searchQuery.trim() ||
                        column.label
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase());

                    // If there's a search query and this column doesn't match, hide it
                    if (searchQuery.trim() && !matchesSearch) {
                        return null;
                    }

                    return (
                        <div
                            key={column.id}
                            className={`column-toggle ${
                                isParent ? "parent" : ""
                            } ${isDependent ? "dependent-column" : ""} ${
                                !isParentSelected ? "parent-disabled" : ""
                            } ${!isEnabled ? "disabled" : ""} ${
                                matchesSearch && searchQuery
                                    ? "search-match"
                                    : ""
                            }`}
                        >
                            <span
                                className={`column-toggle-label ${
                                    !isParentSelected ? "text-muted" : ""
                                }`}
                            >
                                {column.label}
                            </span>
                            <label
                                className={`toggle-switch ${
                                    !isParentSelected ? "toggle-disabled" : ""
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleColumnClick(column)}
                                    disabled={!isEnabled}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Function to check if a category has any columns that match the search
    const categoryHasMatchingColumns = (categoryColumns) => {
        if (!searchQuery.trim()) return true;

        return Object.values(categoryColumns).some((column) =>
            column.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    return (
        <div className="side-panel h-full">
            <div className="side-panel-header">
                <h2>Column Selection</h2>
                <p className="subtitle">
                    Select columns to include in your report
                </p>

                {/* Add search input */}
                <div className="search-container">
                    <input
                        type="text"
                        className="column-search"
                        placeholder="Search columns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="clear-search"
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
            <div className="categories-wrapper h-full">
                {Object.entries(columns).map(([section, sectionColumns]) => {
                    // If there's a search query and this section has no matches, hide it
                    if (searchQuery.trim() && !sectionsWithResults[section]) {
                        return null;
                    }

                    return (
                        <div key={section} className="main-accordion">
                            <div
                                className="main-accordion-header"
                                onClick={() => toggleMainSection(section)}
                            >
                                <h2>{formatSectionTitle(section)}</h2>
                                <span
                                    className={`caret ${
                                        expandedSections[section] ||
                                        (searchQuery &&
                                            sectionsWithResults[section])
                                            ? "caret-up"
                                            : "caret-down"
                                    }`}
                                ></span>
                            </div>
                            {(expandedSections[section] ||
                                (searchQuery &&
                                    sectionsWithResults[section])) && (
                                <div className="main-accordion-content">
                                    {Object.entries(sectionColumns).map(
                                        ([category, categoryColumns]) => {
                                            // If there's a search query and this category has no matches, hide it
                                            if (
                                                searchQuery.trim() &&
                                                !categoriesWithResults[
                                                    category
                                                ] &&
                                                !categoryHasMatchingColumns(
                                                    categoryColumns
                                                )
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <div
                                                    key={category}
                                                    className="category-section"
                                                >
                                                    <div
                                                        className="category-header"
                                                        onClick={() =>
                                                            toggleCategory(
                                                                category
                                                            )
                                                        }
                                                    >
                                                        <h3>
                                                            {formatSectionTitle(
                                                                category
                                                            )}
                                                        </h3>
                                                        <span
                                                            className={`caret ${
                                                                expandedCategories[
                                                                    category
                                                                ] ||
                                                                (searchQuery &&
                                                                    categoriesWithResults[
                                                                        category
                                                                    ])
                                                                    ? "caret-up"
                                                                    : "caret-down"
                                                            }`}
                                                        ></span>
                                                    </div>
                                                    {(expandedCategories[
                                                        category
                                                    ] ||
                                                        (searchQuery &&
                                                            categoriesWithResults[
                                                                category
                                                            ])) && (
                                                        <div className="category-content">
                                                            {renderColumns(
                                                                categoryColumns
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SidePanel;
