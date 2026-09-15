import { useEffect, useRef, useState } from "react";
import { X, Send, Check, Copy } from "lucide-react";
import ProjectVisual from "./ProjectVisual";
import ProjectPreview from "./ProjectPreview";
import { contactEmail } from "../data/portfolio";
export default function PortfolioDialog({ modal, onClose }) {
  const dialog = useRef(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement;
    el.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      el.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  const copyBrief = async (e) => {
    e.preventDefault();
    const values = new FormData(e.currentTarget);
    const brief = `Project inquiry\n\nName: ${values.get("name")}\nEmail: ${values.get("email")}\n\n${values.get("message")}`;
    if (contactEmail) {
      window.location.href = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent(`Project inquiry from ${values.get("name")}`)}&body=${encodeURIComponent(brief)}`;
      setCopied(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setError("");
    } catch {
      setError(
        "Clipboard access is unavailable. You can copy the text from the fields above.",
      );
    }
  };
  const isContact = modal === "contact";
  return (
    <dialog
      ref={dialog}
      className="portfolio-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target !== dialog.current) return;
        const bounds = dialog.current.getBoundingClientRect();
        if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <button
        className="close-dialog icon-button"
        onClick={onClose}
        aria-label="Close dialog"
      >
        <X size={20} />
      </button>
      {isContact ? (
        <>
          <p className="eyebrow">A GOOD PLACE TO START</p>
          <h2 id="dialog-title">
            Tell me what
            <br />
            you’re <em>imagining.</em>
          </h2>
          <p className="dialog-intro">
            A new product, a tricky integration, or a better way to ship. Put
            the idea into words.
          </p>
          <form onSubmit={copyBrief} onChange={() => setCopied(false)}>
            <div className="form-row">
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Alex Taylor"
                  required
                  maxLength={100}
                />
              </label>
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex@company.com"
                  required
                />
              </label>
            </div>
            <label>
              What would you like to build?
              <textarea
                name="message"
                placeholder="A little about your idea, timeline, and what you need…"
                required
                rows={4}
                maxLength={5000}
              />
            </label>
            <button className="button button-lime" type="submit">
              {contactEmail
                ? "Continue to email"
                : copied
                  ? "Brief copied"
                  : "Copy project brief"}
              {contactEmail ? (
                <Send size={16} />
              ) : copied ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
            </button>
            <p className="form-note" role="status">
              {error ||
                (contactEmail
                  ? "Opens a draft in your email app. Review it there before sending."
                  : copied
                    ? "Your brief is ready to paste into an email or message. Nothing has been sent."
                    : "Contact details are being configured. Save your brief to share later.")}
            </p>
          </form>
        </>
      ) : (
        <>
          <p className="eyebrow">
            {modal.category.toUpperCase()} / CONCEPT PROJECT
          </p>
          <h2 id="dialog-title">
            {modal.name}
            <span className="lime">.</span>
          </h2>
          <p className="dialog-intro">{modal.type}</p>
          {modal.id === '01' || modal.id === '02' ? <ProjectVisual kind={modal.visual} /> : <ProjectPreview project={modal} />}
          <div className="dialog-detail">
            <h3>The idea</h3>
            <p>{modal.challenge}</p>
            <h3>The architecture</h3>
            <p>{modal.approach}</p>
            <div className="project-tags">
              {modal.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
