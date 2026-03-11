import "./GoalRing.scss";

const GoalRing = ({ icon, label, percent = 0, color = "#E8334A", size = 80 }) => {
    const rings = [
        { r: size * 0.46, strokeWidth: size * 0.09 },
        { r: size * 0.35, strokeWidth: size * 0.09 },
    ];

    const mainRing = rings[0];
    const circumference = 2 * Math.PI * mainRing.r;
    const offset = circumference * (1 - Math.min(percent, 100) / 100);

    return (
        <div className="goal-ring-cont">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>

                <circle
                    key={0}
                    cx={80 / 2}
                    cy={80 / 2}
                    r={80 * 0.46}
                    fill="none"
                    stroke={`${color}22`}
                    strokeWidth={80 * 0.09}
                />

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={mainRing.r}
                    fill="none"
                    stroke={color}
                    strokeWidth={mainRing.strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={rings[1].r - rings[1].strokeWidth / 2}
                    fill={color}
                />
                <foreignObject
                    x={size / 2 - 12}
                    y={size / 2 - 12}
                    width={24}
                    height={24}
                >
                    <div className="goal-ring-icon">{icon}</div>
                </foreignObject>
            </svg>

            <div className="goal-ring-label-cont">
                <span className="goal-ring-label">{label}</span>
                <span className="goal-ring-percent">{percent}%</span>
            </div>


        </div>
    );
};

export default GoalRing;
