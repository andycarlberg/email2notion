const Button = ({ variant, disabled, onClick, children }) => {
  const clickHandler = (e) => {
    e.preventDefault();
    onClick(e);
  };

  let className = "";
  switch (variant) {
    case "text":
      className =
        "px-4 py-2 bg-transparent border rounded border-purple-700 text-purple-500 font-bold";
      break;

    default:
      className =
        "px-4 py-2 bg-purple-500 border rounded border-purple-700 text-white font-bold";
      break;
  }

  return (
    <button className={className} disabled={disabled} onClick={clickHandler}>
      {children}
    </button>
  );
};

export default Button;
