const Button = ({ type, disabled, onClick, children }) => {
  const clickHandler = (e) => {
    e.preventDefault();
    onClick(e);
  };
  return (
    <button
      className="px-4 py-2 p= bg-purple-500 border rounded border-purple-700 text-white font-bold"
      type={type}
      disabled={disabled}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default Button;
