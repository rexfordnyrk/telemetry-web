import React from "react";
import { Card } from "react-bootstrap";
import { useLayout } from "../context/LayoutContext";

const ThemeTestCard: React.FC = () => {
  const { theme } = useLayout();

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>Theme Test - Current: {theme}</Card.Title>
        <Card.Text>
          This text should be readable in all themes. If you can read this
          clearly, the theme contrast is working properly.
        </Card.Text>
        <div className="text-muted">This is muted text</div>
        <div className="text-primary">This is primary text</div>
        <div className="text-success">This is success text</div>
        <div className="text-warning">This is warning text</div>
        <div className="text-danger">This is danger text</div>
        <p className="mb-0 mt-2">
          Current theme attribute:
          <code className="ms-2">
            {document.documentElement.getAttribute("data-bs-theme")}
          </code>
        </p>
      </Card.Body>
    </Card>
  );
};

export default ThemeTestCard;
