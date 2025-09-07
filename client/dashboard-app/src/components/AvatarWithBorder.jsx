import { useState } from "react";

function AvatarWithBorder({
  src,
  size = 214,
  borderColor = "#46AA97",
  imageScale = 0.9, // scale mặc định
  hoverScale = 1.05, // scale khi hover
  transition = "0.3s", // thời gian animation
}) {
  const [isHover, setIsHover] = useState(false);

  const center = size / 2;
  const radius = size / 2 - 2; // trừ strokeWidth/2

  // scale động theo hover
  const currentScale = isHover ? imageScale * hoverScale : imageScale;
  const imageSize = size * currentScale;
  const offset = (size - imageSize) / 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ cursor: "pointer" }}
    >
      <defs>
        <clipPath id="avatarClip">
          <circle cx={center} cy={center} r={(size * imageScale) / 2} />
        </clipPath>
      </defs>

      {/* Ảnh avatar */}
      <image
        className="avatar-img"
        href={src}
        x={offset}
        y={offset}
        width={imageSize}
        height={imageSize}
        clipPath="url(#avatarClip)"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transition: `all ${transition} ease`,
        }}
        onError={(e) => {
          e.target.href.baseVal =
            "http://27.75.93.31:5001/avatars/1757071282996-1058.jpeg";
        }}
      />

      {/* Viền dashed */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={borderColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="6 6"
      />
    </svg>
  );
}

export default AvatarWithBorder;
