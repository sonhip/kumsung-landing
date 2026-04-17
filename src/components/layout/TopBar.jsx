import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  FacebookFilled,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { SITE_TEXT } from "../../constants/siteText";

const TopBar = ({ contact = SITE_TEXT.contact }) => {
  return (
    <div className="topbar" aria-label="Thông tin liên hệ doanh nghiệp">
      <div className="container topbar-inner">
        <div className="topbar-left">
          <span>
            <PhoneOutlined aria-hidden="true" /> {contact.phone}
          </span>
          <span>
            <ClockCircleOutlined aria-hidden="true" /> {contact.hours}
          </span>
          <span>
            <EnvironmentOutlined aria-hidden="true" /> {contact.addressFull}
          </span>
        </div>
        <div className="topbar-right">
          <a
            href={`mailto:${contact.email}`}
            aria-label={contact.emailAriaLabel}
          >
            <MailOutlined />
          </a>
          <a
            href={contact.facebookUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={contact.facebookAriaLabel}
          >
            <FacebookFilled />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
