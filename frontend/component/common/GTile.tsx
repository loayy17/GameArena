import { GAvatar } from "./GAvatar";
import type { GTileProps } from "./def/GTile";

function GTile({ user, size = "md" }: GTileProps) {
  return (
    <GAvatar
      firstName={user.firstName}
      lastName={user.lastName}
      userName={user.userName}
      size={size}
      shape="circle"
    />
  );
}

export { GTile };
