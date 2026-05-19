import {FaCheck, IoMdPerson, MdOutlineCancel} from "../../../assets/icons";
import CustomBtn from "../../../components/CustomBtn";

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

    return (
        <div className={cardClassName}>
            <div className={headClassName}>
                <div className={avatarClassName}>
                    <IoMdPerson />
                </div>
                <div className={infoClassName}>
                    <strong>{name}</strong>
                    <p>{email}</p>
                </div>
            </div>
            <div className={actionsClassName}>
                <CustomBtn
                    icon={<MdOutlineCancel size={20} />}
                    className={rejectButtonClassName}
                    onClick={() => onReject(athleteId, trainerId)}
                    disabled={isApproving || isRejecting}
                />
                <CustomBtn
                    icon={<FaCheck />}
                    className={approveButtonClassName}
                    onClick={() => onApprove(athleteId, trainerId)}
                    disabled={isApproving || isRejecting}
                />
            </div>
        </div>
    );
};

export default IncomingRequestCard;
