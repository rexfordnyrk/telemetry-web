import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface NewUser {
  name: string;
  username: string;
  avatar: string;
}

interface NewUsersData {
  title: string;
  users: NewUser[];
}

interface NewUsersWidgetProps {
  data?: NewUsersData;
  showDropdown?: boolean;
}

const defaultNewUsersData: NewUsersData = {
  title: "New Users",
  users: [
    {
      name: "Elon Jonado",
      username: "elon_deo",
      avatar: "/assets/images/avatars/01.png",
    },
    {
      name: "Alexzender Clito",
      username: "zli_alexzender",
      avatar: "/assets/images/avatars/02.png",
    },
    {
      name: "Michle Tinko",
      username: "tinko_michle",
      avatar: "/assets/images/avatars/03.png",
    },
    {
      name: "KailWemba",
      username: "wemba_kl",
      avatar: "/assets/images/avatars/04.png",
    },
    {
      name: "Henhco Tino",
      username: "Henhco_tino",
      avatar: "/assets/images/avatars/05.png",
    },
    {
      name: "Gonjiko Fernando",
      username: "gonjiko_fernando",
      avatar: "/assets/images/avatars/06.png",
    },
    {
      name: "Specer Kilo",
      username: "specer_kilo",
      avatar: "/assets/images/avatars/08.png",
    },
  ],
};

const NewUsersWidget: React.FC<NewUsersWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const usersData = data || defaultNewUsersData;

  return (
    <Card className="w-100 rounded-4">
      <Card.Header className="border-0 p-3 border-bottom">
        <div className="d-flex align-items-start justify-content-between">
          <div>
            <h5 className="mb-0">{usersData.title}</h5>
          </div>
          {showDropdown && (
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="dropdown-toggle-nocaret options"
              >
                <span className="material-icons-outlined fs-5">
                  more_vert
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Action</Dropdown.Item>
                <Dropdown.Item>Another action</Dropdown.Item>
                <Dropdown.Item>Something else here</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="user-list p-3">
          <div className="d-flex flex-column gap-3">
            {usersData.users.map((user, index) => (
              <div
                key={index}
                className="d-flex align-items-center gap-3"
              >
                <img
                  src={user.avatar}
                  width="45"
                  height="45"
                  className="rounded-circle"
                  alt={user.name}
                />
                <div className="flex-grow-1">
                  <h6 className="mb-0">{user.name}</h6>
                  <p className="mb-0">{user.username}</p>
                </div>
                <div className="form-check form-check-inline me-0">
                  <input
                    className="form-check-input ms-0"
                    type="checkbox"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="bg-transparent p-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <a href="#" className="sharelink">
            <i className="material-icons-outlined">share</i>
          </a>
          <a href="#" className="sharelink">
            <i className="material-icons-outlined">textsms</i>
          </a>
          <a href="#" className="sharelink">
            <i className="material-icons-outlined">email</i>
          </a>
          <a href="#" className="sharelink">
            <i className="material-icons-outlined">attach_file</i>
          </a>
          <a href="#" className="sharelink">
            <i className="material-icons-outlined">event</i>
          </a>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default NewUsersWidget;
