import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="bg-error min-vh-100 d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} className="text-center">
            <div className="error-title text-primary">404</div>
            <div className="error-sub-title mb-4">Page Not Found</div>
            <p className="mb-4">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
            <Link to="/">
              <Button variant="primary" size="lg">
                <i className="material-icons-outlined me-2">home</i>
                Go to Dashboard
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
