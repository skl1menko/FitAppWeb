import {GoCheckCircleFill} from "../../../assets/icons";
import "./SearchPanel.scss";

const VARIANT_CLASSES = {
    trainer: {
        panel: "trainer-panel-cont",
        searchRow: "trainer-search-row",
        hint: "trainer-hint-text",
        message: "trainer-message-text",
        error: "trainer-error-text",
        results: "trainer-results-list"
    },
    clients: {
        panel: "clients-panel-cont",
        searchRow: "clients-search-row",
        hint: "clients-hint-text",
        message: "clients-message-text",
        error: "clients-error-text",
        results: "clients-results-list"
    }
};

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
    variant = "trainer",
    panelClassName,
    searchRowClassName,
    hintClassName,
    messageClassName,
    errorClassName,
    resultsClassName,
    children
}) => {
    const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.trainer;
    const panelClasses = panelClassName || variantClasses.panel;
    const searchRowClasses = searchRowClassName || variantClasses.searchRow;
    const hintClasses = hintClassName || variantClasses.hint;
    const messageClasses = messageClassName || variantClasses.message;
    const errorClasses = errorClassName || variantClasses.error;
    const resultsClasses = resultsClassName || variantClasses.results;

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
