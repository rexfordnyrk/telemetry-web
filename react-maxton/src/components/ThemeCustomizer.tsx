import React, { useState } from "react";
import { Offcanvas, Button, Row, Col } from "react-bootstrap";
import { useLayout } from "../context/LayoutContext";
import { ThemeVariant } from "../types";

const ThemeCustomizer: React.FC = () => {
  const [show, setShow] = useState(false);
  const { theme, setTheme } = useLayout();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleThemeChange = (newTheme: ThemeVariant) => {
    setTheme(newTheme);
  };

  const themes = [
    { id: "blue-theme", name: "Blue", icon: "contactless" },
    { id: "light", name: "Light", icon: "light_mode" },
    { id: "dark", name: "Dark", icon: "dark_mode" },
    { id: "semi-dark", name: "Semi Dark", icon: "contrast" },
    { id: "bordered-theme", name: "Bordered", icon: "border_style" },
  ];

  return (
    <>
      <Button
        className="btn btn-grd btn-grd-primary position-fixed bottom-0 end-0 m-3 d-flex align-items-center gap-2"
        onClick={handleShow}
      >
        <i className="material-icons-outlined">tune</i>
        Customize
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        backdrop
        scroll
      >
        <Offcanvas.Header closeButton className="border-bottom h-70">
          <div>
            <Offcanvas.Title className="mb-0">Theme Customizer</Offcanvas.Title>
            <p className="mb-0">Customize your theme</p>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <p>Theme variation</p>
            <Row className="g-3">
              {themes.map((themeOption) => (
                <Col xs={12} xl={6} key={themeOption.id}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="theme-options"
                    id={themeOption.id}
                    checked={theme === themeOption.id}
                    onChange={() =>
                      handleThemeChange(themeOption.id as ThemeVariant)
                    }
                  />
                  <label
                    className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4 w-100"
                    htmlFor={themeOption.id}
                  >
                    <span className="material-icons-outlined">
                      {themeOption.icon}
                    </span>
                    <span>{themeOption.name}</span>
                  </label>
                </Col>
              ))}
            </Row>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ThemeCustomizer;
