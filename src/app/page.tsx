import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Describe your machine",
    description:
      "Give your AI agent, service, or autonomous system a name, purpose, and capabilities.",
  },
  {
    number: "02",
    title: "Create its mark",
    description:
      "Generate a permanent MOTB-8 Tag and signed information about your machine presence.",
  },
  {
    number: "03",
    title: "Keep control",
    description:
      "Save your encrypted Control File, manage updates, and publish your machine information wherever you choose.",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link href="/" className="brand" aria-label="MOTB-8 home">
          <span className="brand-symbol" aria-hidden="true">
            <span className="brand-core" />
            <span className="brand-signal" />
          </span>
          <span>MOTB-8</span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#how-it-works">How it works</a>
          <a href="#get-started">Get started</a>
          <a
            href="https://github.com/HouseMachine/MOTB-8"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">MACHINE OPEN TAG & BEACON</p>

            <h1>
              Make Your Machine
              <span> Discoverable.</span>
            </h1>

            <p className="hero-description">
              An open way to give your AI agent, software service, or
              autonomous system a permanent identifier and signed information
              about what it does.
            </p>

            <div className="hero-actions">
              <a href="#get-started" className="button button-primary">
                Create MOTB-8 <span aria-hidden="true">↗</span>
              </a>
              <a href="#how-it-works" className="button button-secondary">
                How it works
              </a>
            </div>

            <p className="hero-note">
              Open source. No account required. Your keys stay yours.
            </p>
          </div>

          <div className="identity-card" aria-label="Illustrative MOTB-8 identity">
            <div className="identity-card-top">
              <span>THE MARK</span>
              <span className="identity-status">
                <span className="status-dot" />
                MACHINE PRESENCE
              </span>
            </div>

            <div className="identity-emblem" aria-hidden="true">
              <div className="emblem-ring">
                <div className="emblem-center">
                  <span className="emblem-dot" />
                </div>
              </div>
            </div>

            <div className="identity-card-bottom">
              <span>PERMANENT TAG</span>
              <code>[[!MOTB-8:1:••••••••:••••]]</code>
              <p>One mark. An evolving Beacon.</p>
            </div>
          </div>
        </section>

        <section id="about" className="section section-intro">
          <p className="eyebrow">WHAT IS MOTB-8?</p>
          <h2>A mark for machines. A signal for discovery.</h2>
          <p>
            MOTB-8 stands for Machine Open Tag & Beacon. It provides a
            permanent identifier for a machine presence and a signed,
            updateable Beacon describing its purpose, capabilities, and
            reachability.
          </p>
          <p>
            MOTB-8 is independent, open source, and designed to work across
            platforms without requiring a central registry or account.
          </p>
        </section>

        <section id="how-it-works" className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SIMPLE BY DESIGN</p>
              <h2>How it works</h2>
            </div>
            <p>
              Create your machine presence, retain control, and prepare its
              public information for independent publication.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="get-started" className="section get-started">
          <div>
            <p className="eyebrow">GET STARTED</p>
            <h2>Your machine deserves its own mark.</h2>
            <p>
              The browser-based creation and management tools are being
              prepared. In the meantime, the open-source MOTB-8 software and
              documentation are available on GitHub.
            </p>
          </div>

          <a
            href="https://github.com/HouseMachine/MOTB-8"
            className="button button-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the software ↗
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>MOTB-8</strong>
          <p>Machine Open Tag & Beacon</p>
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/HouseMachine/MOTB-8"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Source
          </a>
          <a
            href="https://github.com/HouseMachine/MOTB-8-Web"
            target="_blank"
            rel="noopener noreferrer"
          >
            Website Source
          </a>
        </div>
        <span>Make Your Machine Discoverable.</span>
      </footer>
    </div>
  );
}
