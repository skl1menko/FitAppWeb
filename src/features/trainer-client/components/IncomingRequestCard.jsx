import {FaCheck, IoMdPerson, MdOutlineCancel} from "../../../assets/icons";
import CustomBtn from "../../../components/CustomBtn";
import "./IncomingRequestCard.scss";

const IncomingRequestCard = ({
    athleteId,
    trainerId,
    name,
    email,
    activeActionKey,
    onApprove,
    onReject,
    cardClassName,
    headClassName,
    avatarClassName,
    infoClassName,
    actionsClassName,
    approveButtonClassName,
    rejectButtonClassName
}) => {
    const approveKey = `approve-${athleteId}-${trainerId}`;
    const rejectKey = `reject-${athleteId}-${trainerId}`;
    const isApproving = activeActionKey === approveKey;
    const isRejecting = activeActionKey === rejectKey;
    const cardClasses = cardClassName || "trainer-result-card trainer-request-card";
    const headClasses = headClassName || "trainer-card-head";
    const avatarClasses = avatarClassName || "trainer-card-avatar";
    const infoClasses = infoClassName || "trainer-result-info";
    const actionsClasses = actionsClassName || "trainer-request-actions trainer-request-actions-compact";
    const rejectButtonClasses = rejectButtonClassName || "trainer-request-icon-btn trainer-request-reject-btn";
    const approveButtonClasses = approveButtonClassName || "trainer-request-icon-btn trainer-request-approve-btn";

    return (
        <div className={cardClasses}>
            <div className={headClasses}>
                <div className={avatarClasses}>
                    <IoMdPerson />
                </div>
                <div className={infoClasses}>
                    <strong>{name}</strong>
                    <p>{email}</p>
                </div>
            </div>
            <div className={actionsClasses}>
                <CustomBtn
                    icon={<MdOutlineCancel size={20} />}
                    className={rejectButtonClasses}
                    onClick={() => onReject(athleteId, trainerId)}
                    disabled={isApproving || isRejecting}
                />
                <CustomBtn
                    icon={<FaCheck />}
                    className={approveButtonClasses}
                    onClick={() => onApprove(athleteId, trainerId)}
                    disabled={isApproving || isRejecting}
                />
            </div>
        </div>
    );
};

export default IncomingRequestCard;
