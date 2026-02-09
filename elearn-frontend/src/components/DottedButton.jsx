import "./DottedButton.css";

const DottedButton = ({ children, onClick, className = "" }) => {
  return (
    <button
      type="button"
      className={`dotted-button ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default DottedButton;
