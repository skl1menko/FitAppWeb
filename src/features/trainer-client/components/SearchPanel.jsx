import {GoCheckCircleFill} from "../../../assets/icons";
import "./SearchPanel.scss";

const SearchPanel = ({
    title,
    query,
    onQueryChange,
    placeholder,
    isSearching,
    showSearching = true,
    message,
    error,
    showResults = true,
    panelClassName,
    searchRowClassName,
    hintClassName,
    messageClassName,
    errorClassName,
    resultsClassName,
    children
}) => {
    const panelClasses = panelClassName || "trainer-panel-cont";
    const searchRowClasses = searchRowClassName || "trainer-search-row";
    const hintClasses = hintClassName || "trainer-hint-text";
    const messageClasses = messageClassName || "trainer-message-text";
    const errorClasses = errorClassName || "trainer-error-text";
    const resultsClasses = resultsClassName || "trainer-results-list";

    return (
        <div className={panelClasses}>
            <h2>{title}</h2>
            <div className={searchRowClasses}>
                <input
                    type="text"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder={placeholder}
                />
            </div>
            {showSearching && isSearching && <p className={hintClasses}>Searching...</p>}

            {message && (
                <p className={messageClasses}>
                    <GoCheckCircleFill />
                    {message}
                </p>
            )}
            {error && <p className={errorClasses}>{error}</p>}

            {showResults && (
                <div className={resultsClasses}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default SearchPanel;
