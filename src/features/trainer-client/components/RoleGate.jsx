const RoleGate = ({
    role,
    allow,
    title,
    message,
    containerClassName,
    contentClassName,
    children
}) => {
    if (role !== allow) {
        return (
            <div className={containerClassName}>
                <div className={contentClassName}>
                    <h1>{title}</h1>
                    <p>{message}</p>
                </div>
            </div>
        );
    }

    return children;
};

export default RoleGate;
