import {GoCheckCircleFill} from "../../../assets/icons";

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
    return (
        <div className={panelClassName}>
            <h2>{title}</h2>
            <div className={searchRowClassName}>
                <input
                    type="text"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder={placeholder}
                />
            </div>
            {showSearching && isSearching && <p className={hintClassName}>Searching...</p>}

            {message && (
                <p className={messageClassName}>
                    <GoCheckCircleFill />
                    {message}
                </p>
            )}
            {error && <p className={errorClassName}>{error}</p>}

            {showResults && (
                <div className={resultsClassName}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default SearchPanel;
