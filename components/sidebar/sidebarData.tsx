import { FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdWorkspacePremium } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";

const SidebarData = [
  {
    id: 0,
    icon: <FaHome />,
    text: "Overview",
    link: "/account"
  },
  {
    id: 1,
    icon: <IoMdSettings />,
    text: "Settings",
    link: "/account/settings"
  },
  {
    id: 2,
    icon: <MdOutlineSecurity />,
    text: "Security",
    link: "/account/security"
  },
  {
    id: 3,
    icon: <MdWorkspacePremium />,
    text: "Subscriptions",
    link: "/account/subscription"
  },
  {
    id: 4,
    icon: <FaSignOutAlt />,
    text: "Sign out",
    link: "/"
  },
]

export default SidebarData;