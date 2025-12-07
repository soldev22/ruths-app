export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #ddd",
        padding: "1.5rem",
        textAlign: "center",
        background: "#1e3a8a",
        color: "#ffffff",
        fontSize: "0.9rem",
        marginTop: "auto",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <a href="/about" style={{ color: "#93c5fd", textDecoration: "none", margin: "0 0.75rem" }}>About</a>
        <a href="/user-guide" style={{ color: "#93c5fd", textDecoration: "none", margin: "0 0.75rem" }}>User Guide</a>
        <a href="/faq" style={{ color: "#93c5fd", textDecoration: "none", margin: "0 0.75rem" }}>FAQ</a>
        <a href="/privacy" style={{ color: "#93c5fd", textDecoration: "none", margin: "0 0.75rem" }}>Privacy</a>
        <a href="/contact" style={{ color: "#93c5fd", textDecoration: "none", margin: "0 0.75rem" }}>Contact</a>
      </div>
      <p>
        © {new Date().getFullYear()} Solutions Developed | Contact:{" "}
        <a
          href="mailto:contact@solutionsdeveloped.co.uk"
          style={{ color: "#93c5fd", textDecoration: "none" }}
        >
          contact@solutionsdeveloped.co.uk
        </a>
      </p>
    </footer>
  );
}
