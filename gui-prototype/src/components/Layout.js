import React from "react";
import Container from "react-bootstrap/Container";

function Layout(props) {
  return (
    <Container fluid className="py-5">
      {props.children}
    </Container>
  );
}

export default Layout;
